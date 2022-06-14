import prisma from "../client";

export default async function getSharePrice(
  from: Date | undefined | null,
  to: Date | undefined | null
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

export async function getLatestSharePrice() {
  return prisma.productionSharePrice.findFirst({
    orderBy: {
      datetime: "desc",
    },
  });
}
