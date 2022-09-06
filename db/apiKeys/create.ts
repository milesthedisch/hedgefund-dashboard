import { prisma } from "../client";
import crypto from "crypto";

export default async function create(user: string) {
  return prisma.apiKey.create({
    data: {
      user,
    },
  });
}
