import prisma from "../client";

export default async function getSharePrice(
  from: Date | string | undefined | null,
  to: Date | string | undefined | null
) {
  console.log(from, to);

  if (from && to) {
    console.log("???");
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
