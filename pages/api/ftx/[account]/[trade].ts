import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import groupBy from "lodash/groupBy";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

const getSeconds = (millis) => ~~(millis / 1000).toFixed(0);

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
    const spot = tickersArray.filter(isSpot)[0];

    let data;
    let startTimeSec;
    let endTimeSec;
    let funding;
    let spotMargin;

    if (startTime !== "null" && endTime !== "null" && startTime && endTime) {
      startTimeSec = getSeconds(new Date(startTime).getTime());
      endTimeSec = getSeconds(new Date(endTime).getTime());

      data = await Promise.all(
        tickersArray.map((ticker) => {
          return client.getOrderHistory({
            market: isSpot(ticker) ? `${spot}/USD` : ticker,
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

      if (spot) {
        spotMargin = await client.getBorrowHistory({
          start_time: startTimeSec,
          end_time: endTimeSec,
        });

        spotMargin.result = spotMargin.result.filter((s) => s.coin === spot);
      }
    } else {
      data = await Promise.all(
        tickersArray.map((ticker) => {
          return client.getOrderHistory({
            market: isSpot(ticker) ? `${spot}/USD` : ticker,
          });
        })
      );

      funding = await client.getFundingPayments({
        future,
      });

      if (spot) {
        spotMargin = await client.getBorrowHistory();
        spotMargin.result = spotMargin.result.filter((s) => s.coin === spot);
      }
    }

    if (!data.length || data.some((d) => !d?.success)) {
      throw data;
    }

    return res.send({ results: data, funding, spotMargin });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, message: e.message });
  }
});
