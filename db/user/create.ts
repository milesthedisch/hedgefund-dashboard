import prisma from "../../db/client";

export default async function createUser({
  firstName,
  lastName,
  email,
  userId,
}) {
  const newEntry = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      auth0UserId: userId,
    },
  });

  return newEntry;
}
