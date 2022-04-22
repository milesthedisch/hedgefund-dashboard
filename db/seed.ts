import prisma from "./client";
import { Role, TransactionType } from "@prisma/client";

// Seed the database with data
async function main() {
  await prisma.user.createMany({
    data: [
      {
        firstName: "admin",
        lastName: "miles",
        email: "milesthedisch@gmail.com",
        auth0UserId: 111,
        role: Role.ADMIN,
      },
      {
        firstName: "Yewande",
        lastName: "Bar",
        email: "yewande@prisma.io",
        auth0UserId: 456,
      },
      {
        firstName: "Bob",
        lastName: "Foo",
        email: "bob@prisma.io",
        auth0UserId: 123,
      },
      {
        firstName: "Angelique",
        email: "angelique@prisma.io",
        auth0UserId: 777,
      },
    ],
  });

  await prisma.userTransactions.createMany({
    data: [
      {
        type: TransactionType.INITIAL_PURCHASE,
        units: 31000,
        datetime: new Date(2022, 4, 14, 13, 25),
        userId: 1,
      },
      {
        type: TransactionType.INITIAL_PURCHASE,
        units: 22000,
        datetime: new Date(2022, 4, 12, 13, 25),
        userId: 2,
      },
      {
        type: TransactionType.INITIAL_PURCHASE,
        units: 20000,
        datetime: new Date(2022, 3, 14, 13, 25),
        userId: 3,
      },
      {
        type: TransactionType.INITIAL_PURCHASE,
        units: 50000,
        datetime: new Date(2022, 2, 4, 13, 25),
        userId: 4,
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
        datetime: new Date(2022, 5, 5, 12),
      },
      {
        strategyId: 1,
        balance: 10000,
        datetime: new Date(2022, 5, 6, 11),
      },
      {
        strategyId: 1,
        balance: 20000,
        datetime: new Date(2022, 5, 7, 10),
      },
      {
        strategyId: 2,
        balance: 0,
        datetime: new Date(2022, 5, 5, 9),
      },
      {
        strategyId: 2,
        balance: 20000,
        datetime: new Date(2022, 5, 6, 8),
      },
      {
        strategyId: 3,
        balance: 0,
        datetime: new Date(2022, 5, 5, 7),
      },
      {
        strategyId: 3,
        balance: 4000,
        datetime: new Date(2022, 5, 6, 6),
      },
      {
        strategyId: 4,
        balance: 0,
        datetime: new Date(2022, 5, 5, 5),
      },
      {
        strategyId: 4,
        balance: 7000,
        datetime: new Date(2022, 5, 16, 4),
      },
    ],
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
