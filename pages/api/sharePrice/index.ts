import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import getProductionSharePrice from "../../../db/productionSharePrice";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { from, to } = req.body;

    let sharePrice;

    try {
      sharePrice = await getProductionSharePrice(from, to);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server Error", success: false });
    }

    return res.status(200).json(sharePrice);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
};

export default handler;
