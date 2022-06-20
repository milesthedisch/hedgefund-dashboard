import prisma from "../client";

export default async function createUser({ auth0UserId }) {
  const newEntry = await prisma.user.create({
    data: {
      auth0UserId,
    },
  });

  return newEntry;
}
