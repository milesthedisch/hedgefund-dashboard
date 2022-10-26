import type { NextApiRequest, NextApiResponse } from "next";
import getSharePrice, { getLatestSharePrice } from "../../../db/sharePrice";
import rateLimit from "../../../util/rateLimit";
import findUnique from "../../../db/apiKeys/findUnique";
import { Fund } from "@prisma/client";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(403).send("Incorrect HTTP code");
  }

  const fund = (req.query.fund || "NEUTRAL") as Fund;

  const authorizationHeader: string = req.headers.authorization;
  const apiKey = authorizationHeader?.match(/Api-Key: ([\w-]+)/);

  if (!apiKey || apiKey.length <= 1) {
    return res.status(400).send("Unauthorized, Api-Key not present.");
  }

  let key: { apiKeyID: string };

  try {
    key = await findUnique(apiKey[1]);

    if (!key) {
      return res.status(400).send("Unauthorized, key not found");
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send("Unauthorized, Api-Key not found.");
  }

  try {
    await limiter.check(res, 10, apiKey[1]);
  } catch (e) {
    return res.status(400).send("Rate limit hit, come back in a bit.");
  }

  if (key) {
    const { from, to, latest } = req.query;

    let sharePrice;

    try {
      if (latest) {
        sharePrice = await getLatestSharePrice(fund);
      } else if (from && to) {
        sharePrice = await getSharePrice(
          (from as any) || new Date(from as string),
          (to as any) || new Date(to as string),
          fund
        );
      } else {
        sharePrice = await getSharePrice(undefined, undefined, fund);
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
}
