import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticationClient, ManagementClient } from "auth0";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { updateUser } from "../../../db/user/update";
import { TransactionType } from "@prisma/client";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getSession(req, res);
  const user = session.user;
  const roles = user["https://app.balmoral.digital/roles"];
  const body = req.body;

  if (!user || !roles.includes("admin")) {
    return res
      .status(401)
      .json({ redirect: "401", message: "Unauthorized", success: false });
  }

  if (req.method !== "PATCH") {
    return res
      .status(405)
      .json({ redirect: "405", message: "Method Not Allowed", success: false });
  }

  const {
    units,
    fee,
    status,
    statusAction,
    unitAction,
    audInvestment,
    unitPrice,
  } = body;

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

    try {
      let updatedAuth0User;
      if (statusAction !== undefined) {
        updatedAuth0User = await managmentClient.updateUser(
          { id: user.sub },
          {
            blocked: statusAction === "block" ? status : !status, //TODO this logic is suss maybe change how the front end is capturing the data
          }
        );
      }

      const unitActionMapping = {
        DEPOSIT: TransactionType.PURCHASE,
        WITHDRAW: TransactionType.REDEMPTION,
      };

      const updateBalmoralUser = await updateUser({
        userId: user.sub,
        units,
        fee,
        unitAction: unitActionMapping[unitAction],
        unitPrice,
        audInvestment,
      });

      return res.status(200).json({
        updatedUser: { updateBalmoralUser, updatedAuth0User },
        success: true,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server error", success: true });
    }
  } else {
    return res.status(401).json({ message: "Unauthrozied", success: false });
  }
});
