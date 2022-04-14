import { PrismaClient } from "@prisma/client";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const prisma = new PrismaClient();

export default withApiAuthRequired(handler);

async function handler(req, res) {
  if (req.method === "POST") {
    return await createStrategyBalance(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function createStrategyBalance(req, res) {
  const { strategyName, balance } = req.body;

  try {
    const { id } = await prisma.strategies.findUnique({
      where: {
        name: strategyName,
      },
      select: {
        id: true,
      },
    });
  } catch (e) {
    console.error("Request error", error);

    res.status(404).json({ error: "Strategy not found", success: false });
  }

  try {
    const newEntry = await prisma.strategyTransactions.create({
      data: {
        datetime: new Date(),
        balance: balance,
        strategyId: id,
      },
    });

    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);

    res.status(500).json({ error: "Error updating balance", success: false });
  }
}
