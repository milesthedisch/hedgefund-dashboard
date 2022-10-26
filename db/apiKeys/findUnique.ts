import { prisma } from "../client";

export default async function findUnique(key: string) {
  return prisma.apiKey.findUnique({
    where: {
      apiKeyID: key,
    },
  });
}
