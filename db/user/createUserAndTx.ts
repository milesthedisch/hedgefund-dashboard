import prisma from "../client";
import { Prisma } from "@prisma/client";

export default async function createUserAndTx(
  auth0UserId: string,
  transaction: { units: number }
) {
  const newEntry = await prisma.user.create({
    data: {
      auth0UserId,
      transactions: {
        create: {
          ...transaction,
        },
      },
    },
  });

  return newEntry;
}
