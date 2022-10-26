import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { prisma } from "../../../db/client";
import { getTotalUnits } from "../../../db/userTxs";
import { Fund, StrategyTransactions } from "@prisma/client";

const sum = (a: number, b: number): number => a + b;

const getUnitPrice = (strategies: any, totalUnits: number) => {
  const nonNullBalances = strategies.filter(
    (strat: { strategyTransactions: StrategyTransactions[] }) => {
      return strat.strategyTransactions[0];
    }
  );

  const balances = nonNullBalances.map(
    (strat: { strategyTransactions: StrategyTransactions[] }) => {
      return ~~strat.strategyTransactions[0].balance;
    }
  );

  const totalBalance = balances.reduce(sum);

  return totalBalance / totalUnits;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fund } = req.query;

  const funds = Object.keys(Fund);

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }

  if (typeof fund !== "string" && !Array.isArray(fund)) {
    return res
      .status(400)
      .json({ message: "Bad request `fund`", success: false });
  }

  try {
    if (Array.isArray(fund)) {
      const isFund = fund.every((f) => {
        return funds.includes(f);
      });

      if (!isFund) {
        return res
          .status(400)
          .json({ message: "Incorrect fund", success: false });
      }

      const getAllStrategies = fund.map((f) =>
        prisma.strategies.findMany({
          where: {
            fund: Fund[f],
          },
          select: {
            strategyTransactions: {
              orderBy: {
                datetime: "desc",
              },
              take: 1,
            },
            name: true,
            fund: true,
          },
        })
      );

      const getAllTotalUnits = fund.map((f) => getTotalUnits(f as Fund));

      const allStrategies = await Promise.all(getAllStrategies);

      const totalUnits = await Promise.all(getAllTotalUnits);

      const unitPrices = allStrategies.map((strats, i) =>
        getUnitPrice(strats, totalUnits[i])
      );

      return res
        .status(200)
        .json({ [fund[0]]: unitPrices[0], [fund[1]]: unitPrices[1] });
    } else {
      if (!funds.includes(fund as string)) {
        return res
          .status(400)
          .json({ message: "Bad request incorrect fund", success: false });
      }

      const strategies = await prisma.strategies.findMany({
        where: {
          fund: Fund[fund],
        },
        select: {
          strategyTransactions: {
            orderBy: {
              datetime: "desc",
            },
            take: 1,
          },
          name: true,
        },
      });

      const totalUnits = await getTotalUnits(fund as Fund);

      const unitPrice = getUnitPrice(strategies, totalUnits);

      return res.status(200).json(unitPrice);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

export default withApiAuthRequired(handler);
