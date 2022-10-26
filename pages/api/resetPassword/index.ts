import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticationClient, ManagementClient } from "auth0";
import type { User } from "auth0";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth0host = new URL(`${process.env.AUTH0_TENTANT_BASE_URL}`).host;

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
      audience: `${process.env.AUTH0_TENTANT_BASE_URL}/api/v2/`,
      scope: `read:users create:users read:connections create:user_tickets`,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: "Bearer token failer", success: false });
  }

  if (bearerToken) {
    try {
      const data = await auth0Client.requestChangePasswordEmail({
        connection: "Username-Password-Authentication",
        email: req.body.email,
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: `${error}`, success: false });
    }
  } else {
    return res.status(401).json({ message: "Unauthrozied", success: false });
  }
});
