import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RestClient } from "ftx-api";
import groupBy from "lodash/groupBy";
import {
  getAllOfResource,
  getAllFunding,
  getAllOrdersHistory,
} from "../../../../util/ftx";

const key = "vN0h2BlDFk2EBaHxglTtXtD4EB9_NRQYx0mVlPFU";
const secret = "ILNvroZ6SUDuvTg9mzc2-u-JnTTX9S1wMjDLwaES";

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

    const perps = tickersArray.filter(isPerp);
    const perpA = perps[0];
    const perpB = perps[1];
    const future = tickersArray.filter(isFuture)[0];
    const spot = tickersArray.filter(isSpot)[0];

    let data;
    let startTimeSec;
    let endTimeSec;
    let funding;
    let spotMargin;
    let fundingA;
    let fundingB;
    let groupedFunding;

    if (startTime !== "null" && endTime !== "null" && startTime && endTime) {
      startTimeSec = getSeconds(new Date(startTime).getTime());
      endTimeSec = getSeconds(new Date(endTime).getTime());

      data = await Promise.all(
        tickersArray.map((ticker) => {
          const market = isSpot(ticker) ? `${spot}/USD` : ticker;
          return getAllOrdersHistory(client, market, startTimeSec, endTimeSec);
        })
      );

      if (perps.length > 1) {
        fundingA = await getAllFunding(client, perpA, startTimeSec, endTimeSec);

        fundingB = await getAllFunding(client, perpB, startTimeSec, endTimeSec);

        groupedFunding = groupBy(
          [...fundingA.result, ...fundingB.result],
          (payment) => {
            return payment.time;
          }
        );
      } else {
        funding = await getAllFunding(client, future, startTimeSec, endTimeSec);
      }

      if (spot) {
        spotMargin = await client.getBorrowHistory({
          start_time: startTimeSec,
          end_time: endTimeSec,
        });

        spotMargin.result = spotMargin.result.filter((s) => s.coin === spot);
      }
    } else {
      const resource = await Promise.all(
        tickersArray.map((ticker) => {
          return client.getOrderHistory({
            market: isSpot(ticker) ? `${spot}/USD` : ticker,
          });
        })
      );

      data = [[...resource[0].result], [...resource[1].result]];

      if (perps.length > 1) {
        fundingA = await client.getFundingPayments({
          future: perpA,
        });

        fundingB = await client.getFundingPayments({
          future: perpB,
        });

        groupedFunding = groupBy(
          [...fundingA.result, ...fundingB.result],
          (payment) => {
            return payment.time;
          }
        );
      } else {
        const res = await client.getFundingPayments({
          future,
        });

        funding = [...res.result];
      }

      if (spot) {
        spotMargin = await client.getBorrowHistory();
        spotMargin.result = spotMargin.result.filter((s) => s.coin === spot);
      }
    }

    if (!data.length || data.some((d) => d?.success === false)) {
      throw data;
    }

    return res.send({
      orders: data,
      funding,
      spotMargin,
      fundingA,
      fundingB,
      groupedFunding,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
});
