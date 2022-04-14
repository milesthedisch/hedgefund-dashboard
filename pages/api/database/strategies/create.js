import { PrismaClient } from "@prisma/client";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const prisma = new PrismaClient();

export default handler;

async function handler(req, res) {
  if (req.method === "POST") {
    return await createStrategy(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function createStrategy(req, res) {
  const { name } = req.body;

  try {
    const newEntry = await prisma.strategies.create({
      data: {
        name: name,
        strategyTransactions: {
          create: {
            balance: 0,
          },
        },
      },
    });

    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error updating balance", success: false });
  }
}
