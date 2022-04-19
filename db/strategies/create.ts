import prisma from "../client";

export default async function createStrategy({ name }) {
  return prisma.strategies.create({
    data: {
      name: name,
      strategyTransactions: {
        create: {
          balance: 0,
        },
      },
    },
  });
}
