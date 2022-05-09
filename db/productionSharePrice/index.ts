import prisma from "../client";

export default async function getProductionSharePrice(
  from: Date | undefined,
  to: Date | undefined
) {
  if (from && to) {
    return prisma.productionSharePrice.findMany({
      where: {
        datetime: {
          gte: from,
          lte: to,
        },
      },
    });
  }

  return prisma.productionSharePrice.findMany();
}
