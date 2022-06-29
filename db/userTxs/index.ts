import prisma from "../client";

export default async function getTxs(sub: string): Promise<number> {
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

  return (purchased._sum.units as any) - (redeemed._sum.units || (0 as any));
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

  return (purchased._sum.units as any) - (redeemed._sum.units as any);
}
