import useSWR from "swr";
import { UserTransactions, User } from "@prisma/client";
import { User as Auth0User } from "auth0";

export type BalmoralUser = User &
  Auth0User<{ balmoralId: number }> & { blocked: boolean } & {
    transactions: UserTransactions[];
  };

export const useUsers = (): BalmoralUser[] => {
  return [];
};
