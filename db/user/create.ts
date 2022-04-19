import prisma from "../../db/client";

export default async function createUser({
  firstName,
  lastName,
  email,
  auth0UserId,
  fullName = null,
}) {
  if (firstName && lastName && !fullName) {
    fullName = firstName + " " + lastName;
  }

  const newEntry = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      auth0UserId,
      fullName,
    },
  });

  return newEntry;
}
