import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const client = new RestClient(key, secret);

export default withApiAuthRequired(async function ftx(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const subAccounts = await client.getSubaccounts();

    if (!subAccounts.success) {
      throw subAccounts;
    }

    if (!subAccounts?.result?.length) {
      return res
        .status(404)
        .send({ success: false, message: "No subaccounts available" });
    }

    const margins = subAccounts.result.map(({ nickname }) => {
      const c = new RestClient(key, secret, { subAccountName: nickname });
      return c.getBorrowHistory();
    });

    const marginResults = await Promise.all(margins);
    subAccounts.result.forEach((acc, idx) => {
      if (marginResults[idx].result.length === 0) return;
      acc.margins = marginResults[idx];
    });

    return res.status(200).send(subAccounts);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
