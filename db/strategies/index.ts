import { prisma } from "../client";

export default async function getStrategies() {
  return prisma.strategies.findMany({
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
