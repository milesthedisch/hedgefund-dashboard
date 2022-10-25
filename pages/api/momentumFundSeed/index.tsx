import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db/client";
// add new users that are in momentum fund
// which are new users that only are in momentum fund
// user fairview green is not in ontraport

// add new strategy balances that are in momentum fund [x]
// add user txs that are in the momentum fund
// add live share price that are in the momentum fund

const seed = async (req: NextApiResponse, res: NextApiResponse) => {
  try {
    await prisma.productionSharePrice.createMany({
      data: [
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 6, 1),
          price: 0,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 6, 21),
          price: 1.005,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 6, 26),
          price: 1.004,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 6, 31),
          price: 0.992,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 7, 3),
          price: 0.978,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 7, 6),
          price: 1.007,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 7, 22),
          price: 1.003,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 7, 28),
          price: 1.054,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 7, 30),
          price: 1.04,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 7, 31),
          price: 1.031,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 8, 7),
          price: 1.03875,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 8, 8),
          price: 1.01639,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 8, 13),
          price: 1.0066,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 8, 25),
          price: 0.99863,
        },
        {
          fund: "MOMENTUM",
          datetime: new Date(2022, 8, 27),
          price: 0.97938,
        },
      ],
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

    await prisma.strategies.createMany({
      data: [
        {
          id: 20,
          name: "CBA Balance - AUD",
          fund: "MOMENTUM",
        },
        {
          id: 21,
          name: "FTX Balance - USD",
          fund: "MOMENTUM",
        },
        {
          id: 22,
          name: "FTX Balance - AUD",
          fund: "MOMENTUM",
        },
        {
          id: 23,
          name: "FTT Balance",
          fund: "MOMENTUM",
        },
      ],
    });

    await prisma.strategyTransactions.createMany({
      data: [
        {
          strategyId: 20,
          balance: 0,
          datetime: new Date(2022, 6, 1),
        },

        {
          strategyId: 20,
          balance: 110000,
          datetime: new Date(2022, 6, 21),
        },

        {
          strategyId: 20,
          balance: 95480,
          datetime: new Date(2022, 6, 26),
        },
        {
          strategyId: 22,
          balance: 14451.34,
          datetime: new Date(2022, 6, 26),
        },

        {
          strategyId: 20,
          balance: 695480,
          datetime: new Date(2022, 6, 26, 1),
        },
        {
          strategyId: 22,
          balance: 14451.34,
          datetime: new Date(2022, 6, 26, 1),
        },

        {
          strategyId: 20,
          balance: 195480,
          datetime: new Date(2022, 6, 31),
        },
        {
          strategyId: 22,
          balance: 353032.16,
          datetime: new Date(2022, 6, 31),
        },

        {
          strategyId: 20,
          balance: 595480.0,
          datetime: new Date(2022, 6, 31, 1),
        },
        {
          strategyId: 22,
          balance: 353032.16,
          datetime: new Date(2022, 6, 31, 1),
        },

        {
          strategyId: 20,
          balance: 518848,
          datetime: new Date(2022, 7, 3),
        },
        {
          strategyId: 22,
          balance: 335480.0,
          datetime: new Date(2022, 7, 3),
        },

        {
          strategyId: 20,
          balance: 518848,
          datetime: new Date(2022, 7, 3, 1),
        },
        {
          strategyId: 22,
          balance: 435480,
          datetime: new Date(2022, 7, 3, 1),
        },

        {
          strategyId: 20,
          balance: 195480.0,
          datetime: new Date(2022, 7, 6),
        },
        {
          strategyId: 21,
          balance: -9753.96,
          datetime: new Date(2022, 7, 6),
        },
        {
          strategyId: 22,
          balance: 1014520.0,
          datetime: new Date(2022, 7, 6),
        },

        {
          strategyId: 20,
          balance: 195480.0,
          datetime: new Date(2022, 7, 6, 1),
        },
        {
          strategyId: 21,
          balance: 50246.04,
          datetime: new Date(2022, 7, 6, 1),
        },
        {
          strategyId: 22,
          balance: 1014520.0,
          datetime: new Date(2022, 7, 6, 1),
        },

        {
          strategyId: 20,
          balance: 0,
          datetime: new Date(2022, 7, 22),
        },
        {
          strategyId: 21,
          balance: 4785,
          datetime: new Date(2022, 7, 22),
        },
        {
          strategyId: 22,
          balance: 1268913.82,
          datetime: new Date(2022, 7, 22),
        },
        {
          strategyId: 23,
          balance: 690.83,
          datetime: new Date(2022, 7, 22),
        },

        {
          strategyId: 20,
          balance: 0,
          datetime: new Date(2022, 7, 28),
        },
        {
          strategyId: 21,
          balance: 49542.41,
          datetime: new Date(2022, 7, 28),
        },
        {
          strategyId: 22,
          balance: 1268913.88,
          datetime: new Date(2022, 7, 28),
        },
        {
          strategyId: 23,
          balance: 638.25,
          datetime: new Date(2022, 7, 28),
        },

        {
          strategyId: 20,
          balance: 0,
          datetime: new Date(2022, 7, 30),
        },
        {
          strategyId: 21,
          balance: 49542.41,
          datetime: new Date(2022, 7, 30),
        },
        {
          strategyId: 22,
          balance: 1268913.88,
          datetime: new Date(2022, 7, 30),
        },
        {
          strategyId: 23,
          balance: 638.25,
          datetime: new Date(2022, 7, 30),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 28594.06,
          datetime: new Date(2022, 7, 31),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1268914.8,
          datetime: new Date(2022, 7, 31),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 0,
          datetime: new Date(2022, 7, 31),
        },
        {
          strategyId: 23,
          // FTT
          balance: 2053.5,
          datetime: new Date(2022, 7, 31),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 34306.34,
          datetime: new Date(2022, 8, 7),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254676.46,
          datetime: new Date(2022, 8, 7),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 0,
          datetime: new Date(2022, 8, 7),
        },
        {
          strategyId: 23,
          // FTT
          balance: 1898.63,
          datetime: new Date(2022, 8, 7),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 15105.89,
          datetime: new Date(2022, 8, 8),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254678.67,
          datetime: new Date(2022, 8, 8),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 0,
          datetime: new Date(2022, 8, 8),
        },
        {
          strategyId: 23,
          // FTT
          balance: 1959.38,
          datetime: new Date(2022, 8, 8),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 15105.89,
          datetime: new Date(2022, 8, 8),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254678.67,
          datetime: new Date(2022, 8, 8),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 0,
          datetime: new Date(2022, 8, 8),
        },
        {
          strategyId: 23,
          // FTT
          balance: 1959.38,
          datetime: new Date(2022, 8, 8),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 15105.89,
          datetime: new Date(2022, 8, 8, 1),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254678.67,
          datetime: new Date(2022, 8, 8, 1),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 20000,
          datetime: new Date(2022, 8, 8, 1),
        },
        {
          strategyId: 23,
          // FTT
          balance: 1959.38,
          datetime: new Date(2022, 8, 8, 1),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 15105.89,
          datetime: new Date(2022, 8, 8, 2),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254678.67,
          datetime: new Date(2022, 8, 8, 2),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 40000,
          datetime: new Date(2022, 8, 8, 2),
        },
        {
          strategyId: 23,
          // FTT
          balance: 1959.38,
          datetime: new Date(2022, 8, 8, 2),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 15105.89,
          datetime: new Date(2022, 8, 8, 2),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254678.67,
          datetime: new Date(2022, 8, 8, 2),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 40000,
          datetime: new Date(2022, 8, 8, 2),
        },
        {
          strategyId: 23,
          // FTT
          balance: 1959.38,
          datetime: new Date(2022, 8, 8, 2),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: 6483.29,
          datetime: new Date(2022, 8, 13),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254694.82,
          datetime: new Date(2022, 8, 13),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 40000,
          datetime: new Date(2022, 8, 13),
        },
        {
          strategyId: 23,
          // FTT
          balance: 2124.6,
          datetime: new Date(2022, 8, 13),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: -2228.86,
          datetime: new Date(2022, 8, 25),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254729.68,
          datetime: new Date(2022, 8, 25),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 40000,
          datetime: new Date(2022, 8, 25),
        },
        {
          strategyId: 23,
          // FTT
          balance: 3563.55,
          datetime: new Date(2022, 8, 25),
        },

        {
          strategyId: 21,
          // FTX USD
          balance: -18849.6,
          datetime: new Date(2022, 8, 27),
        },
        {
          strategyId: 22,
          // FTX AUD
          balance: 1254735.92,
          datetime: new Date(2022, 8, 27),
        },
        {
          strategyId: 20,
          // CBA BALANCE
          balance: 40000,
          datetime: new Date(2022, 8, 27),
        },
        {
          strategyId: 23,
          // FTT
          balance: 3749.55,
          datetime: new Date(2022, 8, 27),
        },
      ],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message, success: false });
  }

  return res.status(200).json({ message: "success!" });
};

export default seed;
