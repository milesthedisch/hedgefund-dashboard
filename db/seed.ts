import prisma from "./client";
import { TransactionType } from "@prisma/client";

const gensis = new Date(2022, 0, 0);

const sharePrices = [
  "1",
  "1",
  "1.05031360266516",
  "1.08012650833422",
  "1.0866354271612",
  "1.0866354271612",
  "1.0866354271612",
  "1.09612556506185",
  "1.09612556506185",
  "1.10297230722228",
  "1.09670313764405",
  "1.09670313764405",
  "1.09670313764405",
  "1.09860167281972",
  "1.10724501212773",
  "1.11324349173524",
  "1.0971384133385",
  "1.0971384133385",
  "1.10466394994662",
  "1.10554916591794",
  "1.10294482403191",
].map((x, i) => {
  gensis.setDate(gensis.getDate() + 7);

  return {
    datetime: gensis.toISOString().replace("Z", "+10:00"),
    price: parseFloat(x),
  };
});

// Seed the date base
async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        auth0UserId: "auth0|622de999c80965006a93c12c",
      },
      {
        id: 2,
        auth0UserId: "auth0|623d37f0125fca006a35293c",
      },
    ],
  });

  await prisma.userTransactions.createMany({
    data: [
      {
        type: TransactionType.PURCHASE,
        units: 31000,
        datetime: new Date(2022, 4, 14, 13, 25),
        userId: 1,
      },
      {
        type: TransactionType.PURCHASE,
        units: 31103,
        datetime: new Date(2022, 4, 16, 13, 25),
        userId: 1,
      },
      {
        type: TransactionType.PURCHASE,
        units: 22000,
        datetime: new Date(2022, 4, 12, 13, 25),
        userId: 2,
      },
      {
        type: TransactionType.PURCHASE,
        units: 44000,
        datetime: new Date(2022, 5, 2, 12, 15),
        userId: 2,
      },
    ],
  });

  await prisma.strategies.createMany({
    data: [
      {
        name: "Cash",
      },
      {
        name: "White Whale",
      },
      {
        name: "Anchor",
      },
      {
        name: "FTX",
      },
    ],
  });

  await prisma.strategyTransactions.createMany({
    data: [
      {
        strategyId: 1,
        balance: 0,
        datetime: new Date(2022, 3, 5, 12),
      },
      {
        strategyId: 1,
        balance: 10000,
        datetime: new Date(2022, 3, 6, 11),
      },
      {
        strategyId: 1,
        balance: 20000,
        datetime: new Date(2022, 3, 7, 10),
      },
      {
        strategyId: 2,
        balance: 0,
        datetime: new Date(2022, 3, 5, 9),
      },
      {
        strategyId: 2,
        balance: 20000,
        datetime: new Date(2022, 3, 6, 8),
      },
      {
        strategyId: 3,
        balance: 0,
        datetime: new Date(2022, 3, 5, 7),
      },
      {
        strategyId: 3,
        balance: 4000,
        datetime: new Date(2022, 3, 6, 6),
      },
      {
        strategyId: 4,
        balance: 0,
        datetime: new Date(2022, 3, 5, 5),
      },
      {
        strategyId: 4,
        balance: 7000,
        datetime: new Date(2022, 3, 16, 4),
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
