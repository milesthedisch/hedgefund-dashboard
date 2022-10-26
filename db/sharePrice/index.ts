import { prisma } from "../client";
import { Fund } from "@prisma/client";

export default async function getSharePrice(
  from: Date | string | undefined | null,
  to: Date | string | undefined | null,
  fund: Fund
) {
  if (from && to) {
    return prisma.productionSharePrice.findMany({
      where: {
        datetime: {
          gte: from,
          lte: to,
        },
        fund,
      },
    });
  }

  return prisma.productionSharePrice.findMany({
    where: {
      fund,
    },
  });
}

export async function getLatestSharePrice(fund: Fund) {
  return prisma.productionSharePrice.findFirst({
    orderBy: {
      datetime: "desc",
    },
    where: {
      fund,
    },
  });
}

export async function getLastSharePriceFrom(fund: Fund, from: Date) {
  return prisma.productionSharePrice.findFirst({
    orderBy: {
      datetime: "desc",
    },
    where: {
      fund,
      datetime: {
        lte: from
      }
    },
  });
}
