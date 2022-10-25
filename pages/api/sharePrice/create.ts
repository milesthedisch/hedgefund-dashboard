import type { NextApiRequest, NextApiResponse } from "next";
import createSharePrice from "../../../db/sharePrice/create";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Fund } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSession(req, res);
  const user = session.user;
  const roles = user["https://app.balmoral.digital/roles"];
  const fund = req.query.fund;

  const funds = Object.keys(Fund);

  if (!funds.includes(fund as string) || typeof fund !== "string") {
    return res.status(400).json({ message: "Incorrect fund", success: false });
  }

  if (!user || !roles.includes("admin")) {
    return res
      .status(401)
      .json({ redirect: "401", message: "Unauthorized", success: false });
  }

  if (req.method === "POST") {
    const { sharePrice } = JSON.parse(req.body);

    if (sharePrice?.length) {
      return res.status(401).send({ message: "Bad Request" });
    }

    try {
      const updatedSharePrice = await createSharePrice(
        sharePrice,
        fund as Fund
      );

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
}

export default withApiAuthRequired(handler);
