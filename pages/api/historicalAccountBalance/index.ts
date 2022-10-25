import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { sub, eachDayOfInterval } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { getLastSharePriceFrom } from "../../../db/sharePrice";
import { getUnitBalanceFrom, userHasTxsInFund } from "../../../db/userTxs";
import { Decimal } from "@prisma/client/runtime";
import { Fund } from "@prisma/client";

//MD: How many data points for corresponding time format "Month", "Day", etc..
enum TIME_DURATION {
  MONTH = 30
  // Add day and year enums for longer time periods.
}

export default withApiAuthRequired(async function(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(403).send("Incorrect HTTP code");
  }

  const timeInterval = req.query["TIME_DURATION"] || "MONTH";
  const timeZone = req.query["TIME_ZONE"] || "Australia/Sydney";

  const { user } = getSession(req, res);

  const notInTimeDuration = !Object.keys(TIME_DURATION).find(x => x === timeInterval);

  if (notInTimeDuration && Array.isArray(timeInterval)) {
    return res.status(400).send("Bad request")
  }

  console.log(timeInterval);

  try {
    // TODO:  Based on time length return a normalized time series 
    // For each time x return the calculated balance.
    if (timeInterval === "MONTH") {
      // Interval of days from 30 days prior at time 00:00:00
      const interval = eachDayOfInterval({
        start: sub(new Date(), { days: TIME_DURATION[timeInterval] }),
        end: (new Date())
      })
        // convert to UTC then to ms
        .map(d => zonedTimeToUtc(d, timeZone as string))

      // Does the user hold more than one type of units
      const userHasTxsInFunds = await Promise.all(Object.keys(Fund)
        .map((f: Fund) => userHasTxsInFund(f, user.sub)));

      const filteredFunds = (userHasTxsInFunds.filter(txs => txs));
      const userIsInMultipleFunds = filteredFunds.length > 1;

      if (userIsInMultipleFunds) {
        const priceAndUnitsSeries = await Promise.all(interval.map(delta => {
          const deltaDate = new Date(delta);

          const balances = Object.keys(Fund).map((fund: Fund) => {
            const sharePrice = getLastSharePriceFrom(fund, deltaDate);
            const balance = getUnitBalanceFrom(user.sub, fund, deltaDate);

            return Promise.all([sharePrice, balance, deltaDate]);
          })

          return Promise.all(balances);
        }));

        const formattedSeries = priceAndUnitsSeries.map((fundsInSeries) => {
          return fundsInSeries.map(([sharePrice, balance, delta]) => {
            return {
              dateTime: new Date(delta),
              accountBalance: new Decimal(sharePrice.price).mul(balance),
              fund: sharePrice.fund
            }
          });
        });

        return res.status(200).send({ historicalBalances: formattedSeries });
      }

      const priceAndUnitsSeries = await Promise.all(interval.map(delta => {
        const deltaDate = new Date(delta);

        const userFund = filteredFunds[0].fund;
        const sharePrice = getLastSharePriceFrom(userFund, deltaDate);
        const unitBalance = getUnitBalanceFrom(user.sub, userFund, deltaDate);

        return Promise.all([sharePrice, unitBalance, deltaDate]);
      }));

      const formattedSeries = priceAndUnitsSeries.map(([sharePrice, balance, delta]) => {
        return {
          dateTime: new Date(delta),
          accountBalance: new Decimal(sharePrice.price).mul(balance),
        }
      });

      return res.status(200).send({ historicalBalances: formattedSeries });
    } else {
      console.error("Time intverval selected is incorrect", timeInterval);
      return res.status(400).send({ success: false, message: "Time interval selected is incorrect." });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send("An error occured while processing your request.");
  }
});
