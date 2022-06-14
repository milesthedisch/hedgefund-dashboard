import prisma from "../client";

export default async function getTxs(sub: string) {
  console.log(sub);

  const purchased = await prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "PURCHASE",
      user: {
        auth0UserId: sub,
      },
    },
  });

  console.log("purchased:", purchased);

  const redeemed = await prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "REDEMPTION",
      user: {
        auth0UserId: sub,
      },
    },
  });

  console.log("redeemed:", redeemed);

  return purchased._sum.units - redeemed._sum.units;
}

export async function getTotalUnits(): Promise<number> {
  const purchased = await prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "PURCHASE",
    },
  });

  const redeemed = await prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "REDEMPTION",
    },
  });

  return purchased._sum.units - redeemed._sum.units;
}
