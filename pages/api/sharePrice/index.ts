import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import getSharePrice, { getLatestSharePrice } from "../../../db/sharePrice";
import { Fund, ProductionSharePrice } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { fund, from, to, latest } = req.query;

    const funds = Object.keys(Fund);

    if (Array.isArray(fund)) {
      if (!fund.every((f) => funds.includes(f))) {
        return res
          .status(400)
          .json({ message: `Incorrect fund ${fund.join(" ")}` });
      }
    } else {
      if (!funds.includes(fund as string) || typeof fund !== "string") {
        return res
          .status(400)
          .json({ message: "Incorrect fund", success: false });
      }
    }

    // get both production share prices if thers an array
    if (Array.isArray(fund)) {
      let sharePrices: any;

      try {
        if (latest) {
          sharePrices = fund.map((f) => getLatestSharePrice(f as Fund));
        } else if (from && to) {
          sharePrices = fund.map((f) =>
            getSharePrice(
              (from as any) || new Date(from as string),
              (to as any) || new Date(to as string),
              f as Fund
            )
          );
        } else {
          sharePrices = fund.map((f) =>
            getSharePrice(undefined, undefined, f as Fund)
          );
        }

        if (!sharePrices) {
          return res.status(400).json({ message: "No data", success: false });
        }

        sharePrices = await Promise.all(sharePrices);

        return res.status(200).json(sharePrices);
      } catch (e) {
        console.error(e);

        return res
          .status(500)
          .json({ message: "Server Error", success: false });
      }
    } else {
      let sharePrice: number | ProductionSharePrice | ProductionSharePrice[];

      try {
        if (latest) {
          sharePrice = await getLatestSharePrice(fund as Fund);
        } else if (from && to) {
          sharePrice = await getSharePrice(
            (from as any) || new Date(from as string),
            (to as any) || new Date(to as string),
            fund as Fund
          );
        } else {
          sharePrice = await getSharePrice(undefined, undefined, fund as Fund);
        }
      } catch (e) {
        console.error(e);
        return res
          .status(500)
          .json({ message: "Server Error", success: false });
      }

      if (!sharePrice) {
        return res.status(400).json({ message: "No data", success: false });
      }

      return res.status(200).json(sharePrice);
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

// export default withApiAuthRequired(handler);
export default handler;
