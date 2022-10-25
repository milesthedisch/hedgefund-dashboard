import { prisma } from "../client";
import { Fund } from "@prisma/client";

export default async function getStrategies(fund: Fund) {
  return prisma.strategies.findMany({
    where: {
      fund,
    },
    select: {
      name: true,
      id: true,
      strategyTransactions: {
        orderBy: {
          datetime: "desc",
        },
        take: 1,
        select: {
          balance: true,
          datetime: true,
        },
      },
    },
  });
}
