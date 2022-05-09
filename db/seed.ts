import prisma from "./client";
import { Role, TransactionType, UserStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const fakeUsers = Array(100)
  .fill(0)
  .map(() => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    auth0UserId: faker.datatype.number({ min: 100, max: 1000 }),
    role: faker.datatype.boolean() ? Role.ADMIN : Role.USER,
    status: faker.datatype.boolean() ? UserStatus.PENDING : UserStatus.ACTIVE,
  }));

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
        status: UserStatus.ACTIVE,
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
        status: UserStatus.PENDING,
      },
      ...fakeUsers,
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
        units: 31103,
        datetime: new Date(2022, 4, 16, 13, 25),
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
        units: 44000,
        datetime: new Date(2022, 5, 2, 12, 15),
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

  const sharePrices = Array(100)
    .fill(0)
    .map((x) => ({
      datetime: faker.date.between(
        new Date(2021).toJSON(),
        new Date(2022, 12).toJSON()
      ),
      price: faker.datatype.number({ min: 1, max: 2, precision: 0.00001 }),
    }));

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
