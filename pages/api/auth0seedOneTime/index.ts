import type { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../db/user/create";
import { AuthenticationClient, ManagementClient } from "auth0";
import { nanoid } from "nanoid/non-secure";
import { prisma } from "../../../db/client";
import type { User } from "auth0";
import sgMail from "@sendgrid/mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;

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
      const user = body.user;

      const authUser = await managmentClient.createUser({
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        name: `${user.given_name} ${user.family_name}`,
        user_metadata: {
          invitationAccepted: user.user_metadata.invitationAccepted,
          address: user.user_metadata.address,
          balmoralId: 0,
          notifiedAdmin: user.user_metadata.notifiedAdmin,
        },
        connection: "Username-Password-Authentication",
        password: "admin123@",
      });

      const transactions = user.transactions
        ? {
            create: user.transactions.map((t) => {
              t.datetime = new Date(t.datetime);
              return t;
            }),
          }
        : null;

      let balmoralUser;
      // Back reference in our db
      if (!transactions) {
        balmoralUser = await prisma.user.create({
          data: {
            auth0UserId: authUser.user_id,
            initalInvestment: user.initalInvestment,
          },
        });
      } else {
        balmoralUser = await prisma.user.create({
          data: {
            auth0UserId: authUser.user_id,
            initalInvestment: user.initalInvestment,
            transactions,
          },
        });
      }

      const newCreatedUser = await prisma.user.findFirst({
        where: {
          auth0UserId: balmoralUser.auth0UserId,
        },
      });

      // Back ref
      await managmentClient.updateUserMetadata(
        { id: authUser.user_id },
        { balmoralId: ~~balmoralUser.id }
      );

      return res.status(200).json({ balmoralUser, authUser, success: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server error", success: true });
    }
  }
}
