import type { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../db/user/create";
import { AuthenticationClient, ManagementClient } from "auth0";
import { nanoid } from "nanoid/non-secure";
import prisma from "../../../db/client";
import type { User } from "auth0";
import sgMail from "@sendgrid/mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;

  const json = await JSON.parse(body);

  if (!json.users.length) {
    return res.status(400).send("Bad data");
  }

  const auth0host = new URL(`${process.env.AUTH0_TENTANT_BASE_URL}`).host;

  const auth0Client = new AuthenticationClient({
    domain: auth0host,
    clientId: `${process.env.AUTH0_CLIENT_ID}`,
    clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
  });

  let bearerToken: { access_token: string };

  try {
    bearerToken = await auth0Client.clientCredentialsGrant({
      audience: `${process.env.AUTH0_TENTANT_BASE_URL}/api/v2/`,
      scope: `read:users`,
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

    const authUsers = await managmentClient.getUsers();

    try {
      const newUsers = [];

      console.log(json.users.length);
      console.log(authUsers.length);

      for (const user of authUsers) {
        const currentAuthUser = json.users.filter((bUser) => {
          return bUser.email === user.email;
        })[0];

        // const authUser = await managmentClient.createUser({
        //   email: user.email,
        //   given_name: user.given_name,
        //   family_name: user.family_name,
        //   name: `${user.given_name} ${user.family_name}`,
        //   user_metadata: {
        //     invitationAccepted: user.user_metadata.invitationAccepted,
        //     address: user.user_metadata.address,
        //     balmoralId: 0,
        //     notifiedAdmin: user.user_metadata.notifiedAdmin,
        //   },
        //   connection: "Username-Password-Authentication",
        //   password: "admin123@",
        // });

        // Back reference in our db
        // await managmentClient.updateUserMetadata(
        //   { id: currentAuthUser.user_id },
        //   { balmoralId: ~~balmoralUser.id }
        // );

        // const changeTicket = await managmentClient.createPasswordChangeTicket({
        //   user_id: authUser.user_id,
        //   mark_email_as_verified: true,
        //   result_url: "https://app.balmoral.digital/api/auth/login",
        // });

        // changeTicket.ticket = changeTicket.ticket.slice(0, -1);

        // newUsers.push({ balmoralUser, authUser });

        if (currentAuthUser) {
          const balmoralUser = await prisma.user.create({
            data: {
              auth0UserId: user.user_id,
              initalInvestment: currentAuthUser.initalInvestment,
              transactions: {
                create: currentAuthUser.transactions.map((t) => {
                  t.datetime = new Date(t.datetime);
                  return t;
                }),
              },
            },
          });

          newUsers.push(balmoralUser);
        }

        // try {
        //   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        //   const msg = {
        //     to: `${authUser.email}`, // Change to your recipient
        //     from: "miles@balmoral.digital", // Change to your verified sender
        //     templateId: "d-3022e8d9421d45e090c159945290fc5a",
        //     dynamicTemplateData: {
        //       subject: `Hey ${authUser.email}, you've been invited.`,
        //       name: `${authUser.given_name}`,
        //       changeTicket: changeTicket.ticket + `&invitation=true`,
        //     },
        //   };

        //   const data = await sgMail.send(msg);

        //   if (data[0].statusCode === 202) {
        //     return res.status(202).json({ newUsers, success: true });
        //   } else {
        //     return res
        //       .status(400)
        //       .json({ success: false, message: "Sendgrid mail failed" });
        //   }
        // } catch (error) {
        //   return res.status(400).json({ message: `${error}`, success: false });
        // }
      }

      return res
        .status(200)
        .json({ data: newUsers.map((u) => u.email), success: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server error", success: true });
    }
  }
}
