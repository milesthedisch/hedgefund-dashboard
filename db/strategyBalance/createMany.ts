import { Prisma } from "@prisma/client";
import { prisma } from "../client";

export default async function createStrategyBalances(newBalances) {
  const strats = await prisma.strategies.findMany();

  const stratsIdAndBalances = strats
    .filter((strat) => {
      const falsy = newBalances[strat.name];

      if (falsy === 0 || falsy > 0) {
        return true;
      }

      if (!!falsy) {
        return false;
      }
    })
    .map((strat) => {
      return {
        balance: newBalances[strat.name],
        strategyId: strat.id,
      };
    });

  const newEntry = await prisma.strategyTransactions.createMany({
    data: stratsIdAndBalances,
  });

  return newEntry;
}
