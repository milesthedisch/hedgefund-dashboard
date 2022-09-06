import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import { getAllFunding } from "../../../../util/ftx";

const getSeconds = (millis) => ~~(millis / 1000).toFixed(0);

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const client = new RestClient(key, secret);

export default withApiAuthRequired(async function ftx(
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

    const startFy = new Date(2021, 5, 31).getTime();
    const endFy = new Date(2022, 6, 1).getTime();

    const startFyInSec = getSeconds(startFy);
    const endFyInSec = getSeconds(endFy);

    const clients = subAccounts.result.map((acc) => {
      return new RestClient(key, secret, {
        subAccountName: `${acc.nickname}`,
      });
    });

    const results = await Promise.all(
      clients.map(async (c) => {
        const positions = await c.getPositions();
        let borrowHist = await c.getBorrowHistory({
          start_time: startFyInSec,
          end_time: endFyInSec,
        });

        const positionsFunding = await Promise.all(
          positions.result.map((pos) => {
            return getAllFunding(c)(pos.future, startFyInSec, endFyInSec);
          })
        );

        const pos = positionsFunding.filter((f) => f.length > 0);

        const summedFundings = pos
          .map((p) => p.map((f) => f.payment))
          .flat()
          .reduce((n, p) => n + p, 0);

        const borrows = borrowHist.result
          .map((b) => b.feeUsd)
          .reduce((n, p) => n + p, 0);

        return {
          subAccount:
            c.requestWrapper.globalRequestOptions.headers["FTX-SUBACCOUNT"],
          summedFundings,
          borrows,
        };
      })
    );

    return res.status(200).send({ results });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
