import { prisma } from "../client";

export default async function getAll() {
  return prisma.apiKey.findMany();
}
