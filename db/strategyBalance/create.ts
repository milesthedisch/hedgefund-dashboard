import { Prisma } from "@prisma/client";
import prisma from "../client";

export default async function createStrategyBalance({ strategyName, balance }) {
  const userId = Prisma.validator<Prisma.UserSelect>()({
    id: true,
  });

  const { id } = await prisma.strategies.findUnique({
    where: {
      name: strategyName,
    },
    select: userId,
  });

  const newEntry = await prisma.strategyTransactions.create({
    data: {
      datetime: new Date(),
      balance: balance,
      strategyId: id,
    },
  });

  return newEntry;
}
