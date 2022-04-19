import prisma from "../client";

export default async function findMany() {
  return await prisma.user.findMany();
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
