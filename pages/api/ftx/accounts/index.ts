import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const client = new RestClient(key, secret);

export default async function ftx(req: NextApiRequest, res: NextApiResponse) {
  let data;

  try {
    const subAccounts = await client.getSubaccounts();

    if (!subAccounts.success) {
      throw data;
    }

    if (!subAccounts?.result?.length) {
      return res
        .status(404)
        .send({ success: false, message: "No subaccounts available" });
    }

    data = subAccounts;
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }

  return res.send(data);
}
