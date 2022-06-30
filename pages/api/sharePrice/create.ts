import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import createSharePrice from "../../../db/sharePrice/create";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { sharePrice } = JSON.parse(req.body);

    if (sharePrice?.length) {
      return res.status(401).send({ message: "Bad Request" });
    }

    try {
      const updatedSharePrice = await createSharePrice(sharePrice);

      return res
        .status(200)
        .send({ success: true, updatedSharePrice: updatedSharePrice });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server Error", success: false });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
};

export default withApiAuthRequired(handler);
