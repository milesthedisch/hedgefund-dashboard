import { prisma } from "../client";
import { TransactionType } from "@prisma/client";

export async function updateUser({
  userId,
  units,
  fee,
  unitPrice,
  audInvestment,
  unitAction,
}) {
  await prisma.user.update({
    where: {
      auth0UserId: userId,
    },
    data: {
      transactions: {
        create: {
          type: unitAction,
          units: units,
          unitPrice: unitPrice,
          audInvestment: audInvestment,
          fee: fee,
        },
      },
    },
  });
}
