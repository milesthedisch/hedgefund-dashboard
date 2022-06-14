import prisma from "../../../db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import protectRoute from "../../../util/protectRoute";
import getTxs from "../../../db/userTxs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = getSession(req, res);

  if (req.method === "GET") {
    try {
      const result = await getTxs(user.sub);

      if (result === null) {
        return res
          .status(404)
          .json({ error: "User not found", success: false });
      }

      return res.status(200).json(result);
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ error: "Error updating balance", success: false });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}
