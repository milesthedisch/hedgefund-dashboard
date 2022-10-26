import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import matchPositionsWithBalanes from "../../../../util/matchPositions";
import groupBy from "lodash/groupBy";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const isInsideString = (string, match) => {
  return string.indexOf(match) > -1;
};

const getSeconds = (millis) => ~~(millis / 1000).toFixed(0);

const isPerp = (future: string) => {
  return future.match(/\w+-PERP$/);
};

const isFuture = (future: string) => {
  return future.match(/\w+-PERP$/) || future.match(/\w+-\d{4}$/);
};

const isSpot = (spot: string) => {
  return !isFuture(spot);
};

export default withApiAuthRequired(async function ftx(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { account } = req.query as { account: string };

  try {
    const client = new RestClient(key, secret, {
      subAccountName: `${account}`,
    });

    const positions = await client.getPositions();
    const balances = await client.getBalances();

    const groupedPos = matchPositionsWithBalanes(positions, balances);

    return res.status(200).json({ result: groupedPos });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
