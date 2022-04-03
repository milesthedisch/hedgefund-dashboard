import { PrismaClient } from "@prisma/client";
import protectRoute from "../../../../util/protectRoute";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const prisma = new PrismaClient();

export default protectRoute(handler);

async function handler(req, res) {
  console.log("HITTING HANDLER");

  if (req.method === "POST") {
    return await createUser(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function createUser(req, res) {
  const body = req.body;

  try {
    const newEntry = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    });

    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating question", success: false });
  }
}
