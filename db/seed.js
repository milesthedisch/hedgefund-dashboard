const { PrismaClient, Role, TransactionType } = require("@prisma/client");

// Seed the database with data
async function seed() {
  const prisma = new PrismaClient();

  await prisma.user.createMany({
    data: [
      {
        firstName: "admin",
        lastName: "miles",
        email: "milesthedisch@gmail.com",
        subId: 111,
        role: Role.ADMIN,
      },
      {
        firstName: "Yewande",
        lastName: "Bar",
        email: "yewande@prisma.io",
        subId: 456,
      },
      { firstName: "Bob", lastName: "Foo", email: "bob@prisma.io", subId: 123 },
      { firstName: "Angelique", email: "angelique@prisma.io", subId: 777 },
    ],
  });

  await prisma.userTransactions.createMany({
    data: [
      {
        type: TransactionType.INITIAL_PURCHASE,
        amount: 31000,
        datatime: new Date(2022, 4, 14, 13, 25),
        userId: 1,
      },
      {
        type: TransactionType.INITIAL_PURCHASE,
        amount: 22000,
        datatime: new Date(2022, 4, 12, 13, 25),
        userId: 2,
      },
      {
        type: TransactionType.INITIAL_PURCHASE,
        amount: 20000,
        datatime: new Date(2022, 3, 14, 13, 25),
        userId: 3,
      },
      {
        type: TransactionType.INITIAL_PURCHASE,
        amount: 50000,
        datatime: new Date(2022, 2, 4, 13, 25),
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
        datetime: new Date(2022, 5, 5),
      },
      {
        strategyId: 1,
        balance: 10000,
        datetime: new Date(2022, 5, 6),
      },
      {
        strategyId: 1,
        balance: 20000,
        datetime: new Date(2022, 5, 7),
      },
      {
        strategyId: 2,
        balance: 0,
        datetime: new Date(2022, 5, 5),
      },
      {
        strategyId: 2,
        balance: 20000,
        datetime: new Date(2022, 5, 6),
      },
      {
        strategyId: 3,
        balance: 0,
        datetime: new Date(2022, 5, 5),
      },
      {
        strategyId: 3,
        balance: 4000,
        datetime: new Date(2022, 5, 6),
      },
    ],
  });
}

return seed();
