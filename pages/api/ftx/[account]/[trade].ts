import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import groupBy from "lodash/groupBy";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const getSeconds = (millis) => ~~((millis % 60000) / 1000).toFixed(0);

export default withApiAuthRequired(async function ftx(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { account, trade, tickers, startTime, endTime } = req.query as {
    account: string;
    trade;
    tickers: string;
    startTime: string;
    endTime: string;
  };

  const tickersArray = tickers.split(",");

  try {
    const client = new RestClient(key, secret, {
      subAccountName: `${account}`,
    });

    let data;

    if (startTime !== "null" && endTime !== "null") {
      data = await Promise.all(
        tickersArray.map((ticker) => {
          return client.getOrderHistory({
            market: ticker,
            start_time: getSeconds(new Date(startTime).getTime()),
            end_time: getSeconds(new Date(endTime).getTime()),
          });
        })
      );
    } else {
      data = await Promise.all(
        tickersArray.map((ticker) => {
          return client.getOrderHistory({
            market: ticker,
          });
        })
      );
    }

    if (!data.length || data.some((d) => !d?.success)) {
      throw data;
    }

    return res.send({ results: data });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
