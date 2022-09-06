import { prisma } from "../client";

export async function getAllUsersWithTxs() {
  return await prisma.user.findMany({
    include: {
      transactions: {
        select: {
          units: true,
          type: true,
          datetime: true,
          userId: true,
        },
        orderBy: {
          datetime: "desc",
        },
      },
    },
  });
}

export async function findUserByID(id: number) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}
