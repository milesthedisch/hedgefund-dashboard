import prisma from "../client";

export default async function createStrategy(price: number) {
  return prisma.productionSharePrice.create({
    data: {
      price,
    },
  });
}
