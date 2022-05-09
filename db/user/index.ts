import prisma from "../client";

export async function findMany() {
  return await prisma.user.findMany({
    include: {
      transactions: {
        select: {
          units: true,
        },
        orderBy: {
          datetime: "desc",
        },
        take: 1,
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

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}
