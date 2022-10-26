import { prisma } from "../client";
import crypto from "crypto";

export default async function deleteOne(apiKeyID: string) {
  const apiKey = crypto.randomUUID();

  return prisma.apiKey.delete({
    where: {
      apiKeyID,
    },
  });
}
