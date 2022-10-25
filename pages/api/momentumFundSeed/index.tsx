import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db/client";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
// add new users that are in momentum fund
// which are new users that only are in momentum fund
// user fairview green is not in ontraport

// add new strategy balances that are in momentum fund [x]
// add user txs that are in the momentum fund
// add live share price that are in the momentum fund

const seed = withApiAuthRequired(async function(req: NextApiRequest, res: NextApiResponse) {
  try {
    await prisma.user.update({
      where: {
        auth0UserId: "auth0|62bd5bb95263d039dfddf276",
      },
      data: {
        transactions: {
          createMany: {
            data: [
              {
                units: 597645.7677,
                unitPrice: 1.00394,
                fee: 0,
                fund: "MOMENTUM",
                audInvestment: 600000,
                type: "PURCHASE",
                datetime: new Date(2022, 6, 21),
              },
              {
                units: 403359.1316,
                unitPrice: 1.00394,
                fee: 0,
                fund: "MOMENTUM",
                audInvestment: 400000,
                type: "PURCHASE",
                datetime: new Date(2022, 6, 31),
              },
            ],
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        auth0UserId: "auth0|62bd5bb95263d039dfddf276",
      },
      data: {
        transactions: {
          createMany: {
            data: [
              {
                units: 50602.8625,
                unitPrice: 0.98611,
                fee: 0.002004,
                fund: "MOMENTUM",
                audInvestment: 50000,
                type: "PURCHASE",
                datetime: new Date(2022, 7, 6),
              },
            ],
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        auth0UserId: "auth0|62bd5bae51b4699d9b2b558a",
      },
      data: {
        transactions: {
          createMany: {
            data: [
              {
                units: 10140.8542,
                unitPrice: 0.98611,
                fund: "MOMENTUM",
                audInvestment: 10000,
                type: "PURCHASE",
                datetime: new Date(2022, 7, 6),
              },
            ],
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        auth0UserId: "auth0|62bd5bb67709b84022ff9e11",
      },
      data: {
        transactions: {
          createMany: {
            data: [
              {
                units: 19639.3604,
                unitPrice: 1.01633,
                fee: 0,
                fund: "MOMENTUM",
                audInvestment: 20000,
                type: "PURCHASE",
                datetime: new Date(2022, 7, 6),
              },
            ],
          },
        },
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message, success: false });
  }

  return res.status(200).json({ message: "success!" });
});

export default seed;
