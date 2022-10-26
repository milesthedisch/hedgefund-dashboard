import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import getUserTotalUnits from "../../../db/userTxs";
import { getLatestSharePrice } from "../../../db/sharePrice";
import { Fund } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

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
      const data = await Promise.all(FUNDS.map(fund => {
        return Promise.all([
          fund, // [0]
          getLatestSharePrice(fund as Fund), // [1]
          getUserTotalUnits(user.sub, fund as Fund) // [2]
        ]);
      }));

      const formatted = data.map((x, i) => {
        return {
          fund: x[0],
          fundInfo: x[1],
          currentBalance: new Decimal(x[1].price).mul(x[2]),
          units: x[2],
        }
      });

      const combined = formatted.map(x => x.currentBalance).reduce((a, b) => a.add(b));

      return res.status(200).json({ funds: formatted, combinedBalance: combined });
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
