import { prisma } from "../client";
import { Fund } from "@prisma/client";

export default async function getUserTotalUnits(sub: string, fund: Fund): Promise<number> {
  const purchased = await prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "PURCHASE",
      fund,
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
      fund,
      user: {
        auth0UserId: sub,
      },
    },
  });

  return (purchased._sum.units as any) - (redeemed._sum.units || (0 as any));
}

export async function getUnitBalanceFrom(sub: string, fund: Fund, from: Date) {
  const purchased = prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "PURCHASE",
      fund,
      user: {
        auth0UserId: sub,
      },
      datetime: {
        lte: from
      }
    },
  });

  const redeemed = prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "REDEMPTION",
      fund,
      user: {
        auth0UserId: sub,
      },
      datetime: {
        lte: from
      }
    },
  });

  const [_redeemed, _purchased] = await Promise.all([redeemed, purchased]);

  return (_purchased._sum.units as any) - (_redeemed._sum.units || (0 as any));
}

export async function getTotalUnits(fund): Promise<number> {
  const purchased = await prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "PURCHASE",
      fund,
    },
  });

  const redeemed = await prisma.userTransactions.aggregate({
    _sum: {
      units: true,
    },
    where: {
      type: "REDEMPTION",
      fund,
    },
  });

  return (purchased._sum.units as any) - (redeemed._sum.units as any);
}

export async function userHasTxsInFund(fund: Fund, sub: string) {
  return await prisma.userTransactions.findFirst({
    where: {
      fund,
      user: {
        auth0UserId: sub
      }
    }
  });
}
