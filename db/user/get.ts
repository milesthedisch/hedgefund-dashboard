import prisma from "../client";

export default async function getUser(sub: string) {
  return await prisma.user.findUnique({
    where: {
      auth0UserId: sub,
    },
  });
}
