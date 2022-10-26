import type { NextApiRequest, NextApiResponse } from "next";
import createStrategy from "../../../db/strategies/create";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getSession(req, res);
  const user = session.user;
  const roles = user["https://app.balmoral.digital/roles"];

  if (!user || !roles.includes("admin")) {
    return res
      .status(401)
      .json({ redirect: "401", message: "Unauthorized", success: false });
  }

  if (req.method === "POST") {
    const data = req.body;

    try {
      const strategy = await createStrategy(data);

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
