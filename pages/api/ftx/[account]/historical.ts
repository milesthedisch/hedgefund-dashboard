import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

export default withApiAuthRequired(async function ftx(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data;

  const { account, all } = req.query as { account: string; all: string };

  try {
    const client = new RestClient(key, secret, {
      subAccountName: `${account}`,
    });

    const json = await client.getAllHistoricalBalances();

    const filter = json.result.filter((r) => {
      return (
        r.results.filter((t) => {
          return t.ticker === "LINK-PERP";
        }).length > 0
      );
    });

    return res.send({ filter });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
