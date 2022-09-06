import { prisma } from "../client";

export default async function createUser({ auth0UserId, initalInvestment }) {
  const newEntry = await prisma.user.create({
    data: {
      auth0UserId,
      initalInvestment,
    },
  });

  return newEntry;
}
