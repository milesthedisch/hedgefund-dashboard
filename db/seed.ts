import prisma from "./client";
import { TransactionType } from "@prisma/client";

const gensis = new Date(2022, 0, 0);

const sharePrices = [
  "1.000000",
  "1.010000",
  "1.050000",
  "1.054000",
  "1.068000",
  "1.073000",
  "1.088000",
  "1.075000",
  "1.074000",
  "1.074000",
  "1.079000",
  "1.080100",
  "1.084300",
  "1.063400",
  "1.076100",
  "1.080300",
  "1.086600",
  "1.086600",
  "1.094200",
  "1.096100",
  "1.102400",
  "1.103000",
  "1.103000",
  "1.096700",
  "1.099000",
  "1.098600",
  "1.099000",
  "1.099700",
  "1.100900",
  "1.100800",
  "1.093800",
  "1.100900",
  "1.100000",
  "1.096700",
  "1.096700",
  "1.107200",
  "1.110200",
  "1.111200",
  "1.113200",
  "1.113500",
  "1.111600",
  "1.097100",
  "1.098600",
  "1.104700",
  "1.104900",
  "1.106400",
  "1.105100",
  "1.107200",
  "1.109400",
  "1.105500",
  "1.105500",
  "1.102900",
].map((x, i) => {
  gensis.setDate(gensis.getDate() + 7);

  return {
    datetime: gensis.toISOString().replace("Z", "+10:00"),
    price: parseFloat(x),
  };
});

// Seed the date base
async function main() {
  await prisma.user.create({
    data: {
      initalInvestment: 0,
      auth0UserId: "auth0|622de999c80965006a93c12c",
      transactions: {
        create: [
          {
            type: "PURCHASE",
            units: 0,
            unitPrice: 1.0,
            audInvestment: 0,
            fee: 0.01,
            datetime: new Date(2022, 0, 1, 0, 0),
          },
        ],
      },
    },
  });

  await prisma.strategies.createMany({
    data: [
      {
        id: 1,
        name: "SOL (USD Value)",
      },
      {
        id: 2,
        name: "Francium Delta Netural",
      },
      {
        id: 3,
        name: "Terra Station Wallet",
      },
      {
        id: 4,
        name: "Terra Cold Wallet",
      },
      {
        id: 5,
        name: "Terra Hot Wallet",
      },
      {
        id: 6,
        name: "WW UST Cold",
      },
      {
        id: 7,
        name: "Karken USDT",
      },
      {
        id: 8,
        name: "CBA Cash",
      },
      {
        id: 9,
        name: "FTX USD",
      },
      {
        id: 10,
        name: "IB Net Liquidation Value",
      },
      {
        id: 11,
        name: "IB Fund For Hedging",
      },
      {
        id: 12,
        name: "IB P&L on FX Hedging",
      },
      {
        id: 13,
        name: "FTT Rebate",
      },
      {
        id: 14,
        name: "UST",
      },
      {
        id: 15,
        name: "Kraken AUD",
      },
      {
        id: 16,
        name: "Kraken USD",
      },
      {
        id: 17,
        name: "Coinspot",
      },
    ],
  });

  await prisma.strategyTransactions.createMany({
    data: [
      {
        strategyId: 8,
        balance: 10000,
        datetime: new Date(2022, 0, 0),
      },
      {
        strategyId: 8,
        balance: 20000,
        datetime: new Date(2022, 0, 0),
      },
      {
        strategyId: 3,
        balance: 17572,
        datetime: new Date(2022, 0, 24),
      },
      {
        strategyId: 1,
        balance: 3224.21,
        datetime: new Date(2022, 0, 24),
      },
      {
        strategyId: 3,
        balance: 27572,
        datetime: new Date(2022, 0, 24, 0, 1),
      },
      {
        strategyId: 8,
        balance: 369,
        datetime: new Date(2022, 1, 1),
      },
      {
        strategyId: 3,
        balance: 27825,
        datetime: new Date(2022, 1, 1),
      },
      {
        strategyId: 2,
        balance: 1478.37,
        datetime: new Date(2022, 1, 1),
      },
      {
        strategyId: 1,
        balance: 4.54,
        datetime: new Date(2022, 1, 1),
      },
      {
        strategyId: 17,
        balance: 1548.61,
        datetime: new Date(2022, 1, 1),
      },
      {
        strategyId: 8,
        balance: 1943.59,
        datetime: new Date(2022, 1, 1),
      },
      {
        strategyId: 3,
        balance: 27935.62,
        datetime: new Date(2022, 2, 1),
      },
      {
        strategyId: 2,
        balance: 1480.2,
        datetime: new Date(2022, 2, 1),
      },
      {
        strategyId: 1,
        balance: 2.76,
        datetime: new Date(2022, 2, 1),
      },
      {
        strategyId: 11,
        balance: 0,
        datetime: new Date(2022, 2, 1),
      },
      {
        strategyId: 8,
        balance: 2246.48,
        datetime: new Date(2022, 2, 7),
      },
      {
        strategyId: 3,
        balance: 27955.89,
        datetime: new Date(2022, 2, 7),
      },
      {
        strategyId: 2,
        balance: 1487.89,
        datetime: new Date(2022, 2, 7),
      },
      {
        strategyId: 1,
        balance: 2.76,
        datetime: new Date(2022, 2, 7),
      },
      {
        strategyId: 4,
        balance: 111.65,
        datetime: new Date(2022, 2, 7),
      },
      {
        strategyId: 11,
        balance: 0,
        datetime: new Date(2022, 2, 7),
      },

      {
        strategyId: 8,
        balance: 2314.55,
        datetime: new Date(2022, 2, 14),
      },
      {
        strategyId: 3,
        balance: 28154.11,
        datetime: new Date(2022, 2, 14),
      },
      {
        strategyId: 2,
        balance: 1493.7,
        datetime: new Date(2022, 2, 14),
      },
      {
        strategyId: 1,
        balance: 3.26,
        datetime: new Date(2022, 2, 14),
      },
      {
        strategyId: 4,
        balance: 118.64,
        datetime: new Date(2022, 2, 14),
      },
      {
        strategyId: 11,
        balance: -668,
        datetime: new Date(2022, 2, 14),
      },

      {
        strategyId: 8,
        balance: 2246,
        datetime: new Date(2022, 2, 16),
      },
      {
        strategyId: 3,
        balance: 28036.04,
        datetime: new Date(2022, 2, 16),
      },
      {
        strategyId: 2,
        balance: 1495.61,
        datetime: new Date(2022, 2, 16),
      },
      {
        strategyId: 1,
        balance: 3.26,
        datetime: new Date(2022, 2, 16),
      },
      {
        strategyId: 4,
        balance: 115.88,
        datetime: new Date(2022, 2, 16),
      },
      {
        strategyId: 11,
        balance: -512,
        datetime: new Date(2022, 2, 16),
      },

      {
        strategyId: 8,
        balance: 2246,
        datetime: new Date(2022, 2, 17),
      },
      {
        strategyId: 3,
        balance: 27950.54,
        datetime: new Date(2022, 2, 17),
      },
      {
        strategyId: 2,
        balance: 1485.51,
        datetime: new Date(2022, 2, 17),
      },
      {
        strategyId: 1,
        balance: 3.26,
        datetime: new Date(2022, 2, 17),
      },
      {
        strategyId: 4,
        balance: 115.88,
        datetime: new Date(2022, 2, 17),
      },
      {
        strategyId: 11,
        balance: -411.2,
        datetime: new Date(2022, 2, 17),
      },

      {
        strategyId: 8,
        balance: 2246,
        datetime: new Date(2022, 2, 22),
      },
      {
        strategyId: 3,
        balance: 27950.54,
        datetime: new Date(2022, 2, 22),
      },
      {
        strategyId: 2,
        balance: 1468.92,
        datetime: new Date(2022, 2, 22),
      },
      {
        strategyId: 1,
        balance: 3.19,
        datetime: new Date(2022, 2, 22),
      },
      {
        strategyId: 4,
        balance: 167.54,
        datetime: new Date(2022, 2, 22),
      },
      {
        strategyId: 11,
        balance: -37,
        datetime: new Date(2022, 2, 22),
      },

      {
        strategyId: 8,
        balance: 2246,
        datetime: new Date(2022, 2, 23),
      },
      {
        strategyId: 3,
        balance: 27431.4,
        datetime: new Date(2022, 2, 23),
      },
      {
        strategyId: 2,
        balance: 1453.24,
        datetime: new Date(2022, 2, 23),
      },
      {
        strategyId: 1,
        balance: 3.16,
        datetime: new Date(2022, 2, 23),
      },
      {
        strategyId: 4,
        balance: 163.21,
        datetime: new Date(2022, 2, 23),
      },
      {
        strategyId: 11,
        balance: 270.5,
        datetime: new Date(2022, 2, 23),
      },

      {
        strategyId: 8,
        balance: 22246.0,
        datetime: new Date(2022, 2, 23, 0, 1),
      },
      {
        strategyId: 3,
        balance: 27431.4,
        datetime: new Date(2022, 2, 23, 0, 1),
      },
      {
        strategyId: 2,
        balance: 1453.24,
        datetime: new Date(2022, 2, 23, 0, 1),
      },
      {
        strategyId: 1,
        balance: 3.16,
        datetime: new Date(2022, 2, 23, 0, 1),
      },
      {
        strategyId: 4,
        balance: 163.21,
        datetime: new Date(2022, 2, 23, 0, 1),
      },
      {
        strategyId: 11,
        balance: 270.5,
        datetime: new Date(2022, 2, 23, 0, 1),
      },

      {
        strategyId: 8,
        balance: 2246.01,
        datetime: new Date(2022, 2, 23, 0, 2),
      },
      {
        strategyId: 3,
        balance: 42173.44,
        datetime: new Date(2022, 2, 23, 0, 2),
      },
      {
        strategyId: 2,
        balance: 1452.43,
        datetime: new Date(2022, 2, 23, 0, 2),
      },
      {
        strategyId: 1,
        balance: 3.15,
        datetime: new Date(2022, 2, 23, 0, 2),
      },
      {
        strategyId: 5,
        balance: 0,
        datetime: new Date(2022, 2, 23, 0, 2),
      },
      {
        strategyId: 11,
        balance: 256.3,
        datetime: new Date(2022, 2, 23, 0, 2),
      },
      {
        strategyId: 6,
        balance: 4438.8,
        datetime: new Date(2022, 2, 23, 0, 2),
      },

      {
        strategyId: 8,
        balance: 2850.82,
        datetime: new Date(2022, 2, 23, 0, 3),
      },
      {
        strategyId: 3,
        balance: 42173.44,
        datetime: new Date(2022, 2, 23, 0, 3),
      },
      {
        strategyId: 2,
        balance: 1452.43,
        datetime: new Date(2022, 2, 23, 0, 3),
      },
      {
        strategyId: 1,
        balance: 3.15,
        datetime: new Date(2022, 2, 23, 0, 3),
      },
      {
        strategyId: 5,
        balance: 0,
        datetime: new Date(2022, 2, 23, 0, 3),
      },
      {
        strategyId: 11,
        balance: 256.3,
        datetime: new Date(2022, 2, 23, 0, 3),
      },
      {
        strategyId: 6,
        balance: 4438.8,
        datetime: new Date(2022, 2, 23, 0, 3),
      },

      {
        strategyId: 8,
        balance: 3050.82,
        datetime: new Date(2022, 2, 23, 0, 4),
      },
      {
        strategyId: 3,
        balance: 42309.73,
        datetime: new Date(2022, 2, 23, 0, 4),
      },
      {
        strategyId: 2,
        balance: 1434.31,
        datetime: new Date(2022, 2, 23, 0, 4),
      },
      {
        strategyId: 1,
        balance: 4.0,
        datetime: new Date(2022, 2, 23, 0, 4),
      },
      {
        strategyId: 5,
        balance: 0,
        datetime: new Date(2022, 2, 23, 0, 4),
      },
      {
        strategyId: 11,
        balance: 256.3,
        datetime: new Date(2022, 2, 23, 0, 4),
      },
      {
        strategyId: 6,
        balance: 4438.8,
        datetime: new Date(2022, 2, 23, 0, 4),
      },

      {
        strategyId: 8,
        balance: 3050.82,
        datetime: new Date(2022, 2, 31),
      },
      {
        strategyId: 3,
        balance: 42309.73,
        datetime: new Date(2022, 2, 31),
      },
      {
        strategyId: 2,
        balance: 1434.31,
        datetime: new Date(2022, 2, 31),
      },
      {
        strategyId: 1,
        balance: 4.0,
        datetime: new Date(2022, 2, 31),
      },
      {
        strategyId: 5,
        balance: 0,
        datetime: new Date(2022, 2, 31),
      },
      {
        strategyId: 11,
        balance: 425,
        datetime: new Date(2022, 2, 31),
      },
      {
        strategyId: 6,
        balance: 4453.8,
        datetime: new Date(2022, 2, 31),
      },

      {
        strategyId: 8,
        balance: 118050.82,
        datetime: new Date(2022, 2, 31, 0, 1),
      },
      {
        strategyId: 3,
        balance: 42309.73,
        datetime: new Date(2022, 2, 31, 0, 1),
      },
      {
        strategyId: 2,
        balance: 1434.31,
        datetime: new Date(2022, 2, 31, 0, 1),
      },
      {
        strategyId: 1,
        balance: 4.0,
        datetime: new Date(2022, 2, 31, 0, 1),
      },
      {
        strategyId: 5,
        balance: 0,
        datetime: new Date(2022, 2, 31, 0, 1),
      },
      {
        strategyId: 11,
        balance: 425,
        datetime: new Date(2022, 2, 31, 0, 1),
      },
      {
        strategyId: 6,
        balance: 4453.2,
        datetime: new Date(2022, 2, 31, 0, 1),
      },

      {
        strategyId: 8,
        balance: 118050.82,
        datetime: new Date(2022, 3, 8),
      },
      {
        strategyId: 3,
        balance: 42309.73,
        datetime: new Date(2022, 3, 8),
      },
      {
        strategyId: 2,
        balance: 1434.31,
        datetime: new Date(2022, 3, 8),
      },
      {
        strategyId: 1,
        balance: 4.0,
        datetime: new Date(2022, 3, 8),
      },
      {
        strategyId: 5,
        balance: 0,
        datetime: new Date(2022, 3, 8),
      },
      {
        strategyId: 11,
        balance: 425,
        datetime: new Date(2022, 3, 8),
      },
      {
        strategyId: 6,
        balance: 4453.2,
        datetime: new Date(2022, 3, 8),
      },
    ],
  });

  await prisma.productionSharePrice.createMany({
    data: sharePrices,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
