import { PrismaClient } from "@prisma/client";
import protectRoute from "../../../../util/protectRoute";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === "GET") {
    return await getAllUsers(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getAllUsers(req, res) {
  const body = req.body;

  try {
    const users = await prisma.user.findMany();

    return res.status(200).json(users, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating question", success: false });
  }
}

export default protectRoute(handler);
