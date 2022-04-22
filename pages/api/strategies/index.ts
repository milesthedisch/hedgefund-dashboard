import type { NextApiRequest, NextApiResponse } from "next";
import getStrategy from "../../../db/strategies";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = req.body;

    try {
      const strategy = await getStrategy();

      res.status(200).send(strategy);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server Error", success: false });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
});
