import { Fund, UserTransactions, Prisma } from "@prisma/client";

export default (
  user: { transactions: UserTransactions[] },
  fund: Fund
): Prisma.Decimal => {
  if (user.transactions.length) {
    let purchased: UserTransactions[] | Prisma.Decimal =
      user.transactions.filter(
        (tx) => tx.type === "PURCHASE" && tx.fund === fund
      );

    if (!purchased.length) {
      purchased = new Prisma.Decimal(0);
    } else {
      purchased = purchased
        .map((tx) => tx.units)
        .map((unit) => new Prisma.Decimal(unit))
        .reduce((a, b) => a.add(b));
    }

    let redeemed: UserTransactions[] | Prisma.Decimal =
      user.transactions.filter(
        (tx) => tx.type === "REDEMPTION" && tx.fund === fund
      );

    if (!redeemed.length) {
      redeemed = new Prisma.Decimal(0);
    } else {
      redeemed = redeemed
        .map((tx) => tx.units)
        .map((unit) => new Prisma.Decimal(unit))
        .reduce((a, b) => a.add(b));
    }

    return purchased.sub(redeemed);
  }
};
