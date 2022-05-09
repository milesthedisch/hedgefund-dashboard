import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { findMany } from "../../../db/user";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getSession(req, res);
  const user = session.user;
  const roles = user["https://balmoral-dashboard.vercel.com/roles"];

  if (!user || !roles.includes("admin")) {
    return res
      .status(401)
      .json({ redirect: "401", message: "Unauthorized", success: false });
  }

  if (req.method === "GET") {
    try {
      const result = await findMany();

      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error updating balance", success: false });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
});
