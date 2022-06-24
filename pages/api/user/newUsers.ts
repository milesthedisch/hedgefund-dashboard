import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticationClient, ManagementClient } from "auth0";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getAllUsersWithTxs } from "../../../db/user";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth0host = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}`).host;

  const auth0Client = new AuthenticationClient({
    domain: auth0host,
    clientId: `${process.env.AUTH0_CLIENT_ID}`,
    clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
  });

  const session = getSession(req, res);
  const user = session.user;
  const roles = user["https://balmoral-dashboard.vercel.com/roles"];

  if (!user || !roles.includes("admin")) {
    return res
      .status(401)
      .json({ redirect: "401", message: "Unauthorized", success: false });
  }

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ redirect: "405", message: "Method Not Allowed", success: false });
  }

  let bearerToken: { access_token: string };

  try {
    bearerToken = await auth0Client.clientCredentialsGrant({
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
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

    try {
      const auth0Users = await managmentClient.getUsers();

      const users = auth0Users.filter((user) => {
        return !user.user_metadata.notifiedAdmin;
      });

      return res.status(200).json({ users, success: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server error", success: true });
    }
  } else {
    return res.status(401).json({ message: "Unauthrozied", success: false });
  }
});