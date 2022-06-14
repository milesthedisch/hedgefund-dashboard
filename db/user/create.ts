import prisma from "../client";
import { TransactionType } from "@prisma/client";

export default async function createUser({ auth0UserId }) {
  const newEntry = await prisma.user.create({
    data: {
      auth0UserId,
    },
  });

  return newEntry;
}
