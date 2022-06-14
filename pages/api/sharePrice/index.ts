import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import getSharePrice, { getLatestSharePrice } from "../../../db/sharePrice";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { from, to, latest } = req.body;

    let sharePrice;

    try {
      if (latest) {
        sharePrice = await getLatestSharePrice();
      } else {
        sharePrice = await getSharePrice(from, to);
      }
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
