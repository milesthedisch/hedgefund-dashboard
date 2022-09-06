// calculate unit price
// inputs: each strategy balance aud, units on issue
// output: unit price aud

import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { prisma } from "../../../db/client";
import { getTotalUnits } from "../../../db/userTxs";

const sum = (a: number, b: number): number => a + b;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const strategies = await prisma.strategies.findMany({
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

  const totalUnits = await getTotalUnits();

  const nonNullBalances = strategies.filter(
    (strat) => strat.strategyTransactions[0]
  );

  const balances = nonNullBalances.map(
    (strategy) => ~~strategy.strategyTransactions[0].balance
  );

  const totalBalance = balances.reduce(sum);

  const unitPrice = totalBalance / totalUnits;

  return res.status(200).json(unitPrice);
};

export default withApiAuthRequired(handler);
