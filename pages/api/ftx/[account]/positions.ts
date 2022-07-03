import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import groupBy from "lodash/groupBy";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

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

    const subAccounts = await client.getPositions();

    if (!subAccounts.success) {
      throw data;
    }

    const filteredPositions = subAccounts.result.filter((r) => {
      return r.size > 0 || r.size < 0;
    });

    const groupedPositions = groupBy(filteredPositions, (r) => {
      return r.future.split("-")[0];
    });

    return res.send({ result: groupedPositions });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
