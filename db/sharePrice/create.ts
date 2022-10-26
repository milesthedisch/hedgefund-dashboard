import { prisma } from "../client";
import { Fund } from "@prisma/client";

export default async function createStrategy(price: number, fund: Fund) {
  return prisma.productionSharePrice.create({
    data: {
      price,
      fund,
    },
  });
}
