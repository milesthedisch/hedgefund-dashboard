import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import groupBy from "lodash/groupBy";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const isInsideString = (string, match) => {
  return string.indexOf(match) > -1;
};

export default withApiAuthRequired(async function ftx(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data;

  const { account } = req.query as { account: string };

  try {
    const client = new RestClient(key, secret, {
      subAccountName: `${account}`,
    });

    const positions = await client.getPositions();
    const balances = await client.getBalances();

    if (!positions.success) {
      console.error("Could not fetch positions");
      throw data;
    }

    if (!balances.success) {
      console.error("Could not fetch balances");
      throw data;
    }

    if (positions.result.length === 0) {
      return res.send({ result: [] });
    }

    const groupedPos = {};

    positions.result.forEach((r) => {
      const tickerA = r.future.split("-")[0];

      // Check if the position has already been matched
      if (Object.keys(groupedPos).length > 0) {
        const alreadyMatched = Object.entries(groupedPos).some((pos: any) => {
          return pos[1].some((p) => p.future === r.future);
        });

        if (alreadyMatched) return;
      }

      const matchBalance = balances.result.find((bal) => {
        return bal.coin === tickerA;
      });

      const match = positions.result.find((pos) => {
        if (pos.future === r.future) return false;
        const tickerB = pos.future.split("-")[0];
        return isInsideString(tickerB, tickerA);
      });

      if (match) {
        groupedPos[tickerA] = [r, match];
      } else if (matchBalance) {
        groupedPos[tickerA] = [r, matchBalance];
      }
    });

    return res.send({ result: groupedPos });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
