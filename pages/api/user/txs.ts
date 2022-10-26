import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import getUserTotalUnits from "../../../db/userTxs";
import { Fund } from "@prisma/client";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = getSession(req, res);
  const { fund } = req.query;

  const FUNDS = Object.keys(Fund);

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }

  try {
    if (Array.isArray(fund) && fund.every((f) => FUNDS.includes(f))) {
      const [txs1, txs2] = await Promise.all([
        getUserTotalUnits(user.sub, fund[0] as Fund),
        getUserTotalUnits(user.sub, fund[1] as Fund),
      ]);

      return res.status(200).json({ [fund[0]]: txs1, [fund[1]]: txs2 });
    } else if (typeof fund === "string" && FUNDS.includes(fund)) {
      const result = await getUserTotalUnits(user.sub, fund as Fund);

      if (result === null) {
        return res
          .status(404)
          .json({ error: "User not found", success: false });
      }

      return res.status(200).json({ result: result });
    } else {
      return res.status(400).json({ error: "Bad request", success: false });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Error updating balance", success: false });
  }
});
