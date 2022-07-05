import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import groupBy from "lodash/groupBy";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const getSeconds = (millis) => ~~(millis / 1000).toFixed(0);

const isFuture = (future: string) => {
  return future.match(/\w+-PERP$/);
};

export default withApiAuthRequired(async function ftx(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { account, tickers, startTime, endTime } = req.query as {
    account: string;
    tickers: string;
    startTime: string;
    endTime: string;
  };

  const tickersArray = tickers.split(",");

  try {
    const client = new RestClient(key, secret, {
      subAccountName: `${account}`,
    });

    const future = tickersArray.filter(isFuture)[0];

    let data;
    let startTimeSec;
    let endTimeSec;
    let funding;

    if (startTime !== "null" && endTime !== "null" && startTime && endTime) {
      startTimeSec = getSeconds(new Date(startTime).getTime());
      endTimeSec = getSeconds(new Date(endTime).getTime());

      data = await Promise.all(
        tickersArray.map((ticker) => {
          return client.getOrderHistory({
            market: ticker,
            start_time: getSeconds(new Date(startTime).getTime()),
            end_time: getSeconds(new Date(endTime).getTime()),
          });
        })
      );

      funding = await client.getFundingPayments({
        future,
        start_time: startTimeSec,
        end_time: endTimeSec,
      });
    } else {
      data = await Promise.all(
        tickersArray.map((ticker) => {
          return client.getOrderHistory({
            market: ticker,
          });
        })
      );

      funding = await client.getFundingPayments({
        future,
      });
    }

    if (!data.length || data.some((d) => !d?.success)) {
      throw data;
    }

    funding.result = funding.result.map((x) => {
      x.createdAt = x.time;
      return x;
    });

    return res.send({ results: data, funding });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
