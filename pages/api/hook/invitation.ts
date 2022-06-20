import type { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../db/user/create";
import protectRoute from "../../../util/protectRoute";
import { AuthenticationClient, ManagementClient } from "auth0";
import { getLatestSharePrice } from "../../../db/sharePrice";
import sgMail from "@sendgrid/mail";
import { nanoid } from "nanoid/non-secure";
import type { User } from "auth0";
import { Prisma } from "@prisma/client";

export default protectRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth0host = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}`).host;

  const auth0Client = new AuthenticationClient({
    domain: auth0host,
    clientId: `${process.env.AUTH0_CLIENT_ID}`,
    clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
  });

  if (!req.body || !req.body.email) {
    return res.status(400).json({ message: "Bad Request", success: false });
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }

  let bearerToken: { access_token: string };

  try {
    bearerToken = await auth0Client.clientCredentialsGrant({
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
      scope: `read:users create:users read:connections create:user_tickets`,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: "Bearer token failer", success: false });
  }

  if (bearerToken) {
    const managmentClient = new ManagementClient({
      token: bearerToken.access_token,
      domain: auth0host,
    });

    let authUser: User;
    let balmoralUser: { id: number };
    let changeTicket: { ticket: string };

    try {
      authUser = await managmentClient.createUser({
        email: req.body.email,
        given_name: req.body.firstName,
        family_name: req.body.lastName,
        name: `${req.body.firstName} ${req.body.lastName}`,
        email_verified: false,
        user_metadata: {
          invitationAccepted: false,
          address: req.body.address,
          notifiedAdmin: false,
          balmoralId: "",
        },
        connection: "Username-Password-Authentication",
        password: nanoid(),
      });

      const netApplication =
        req.body.initalInvestment -
        req.body.initalInvestment * (req.body?.fee || 0.01);

      const unitPrice = await getLatestSharePrice();

      const totalUnits = netApplication / Number(unitPrice.price);

      balmoralUser = await createUser({
        auth0UserId: authUser.user_id,
        initalInvestment: req.body.initalInvestment,
      });

      // Back reference in our db
      await managmentClient.updateUserMetadata(
        { id: authUser.user_id },
        { balmoralId: balmoralUser.id }
      );

      changeTicket = await managmentClient.createPasswordChangeTicket({
        user_id: authUser.user_id,
        mark_email_as_verified: true,
        result_url: "http://localhost:3000/api/auth/login",
      });

      changeTicket.ticket = changeTicket.ticket.slice(0, -1);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server error", success: true });
    }

    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: `${authUser.email}`, // Change to your recipient
        from: "miles@balmoral.digital", // Change to your verified sender
        templateId: "d-3022e8d9421d45e090c159945290fc5a",
        dynamicTemplateData: {
          subject: `Hey ${authUser.email}, you've been invited.`,
          name: `${authUser.given_name}`,
          changeTicket: changeTicket.ticket + `&invitation=true`,
        },
      };

      const data = await sgMail.send(msg);

      if (data[0].statusCode === 202) {
        return res.status(202).json({ success: true });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Sendgrid mail failed" });
      }
    } catch (error) {
      return res.status(400).json({ message: `${error}`, success: false });
    }
  } else {
    return res.status(401).json({ message: "Unauthrozied", success: false });
  }
});
