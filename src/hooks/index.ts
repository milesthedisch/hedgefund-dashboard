import useSWR from "swr";
import { User } from "@prisma/client";
import { UserData } from "auth0";

export type BalmoralUser = User &
  UserData<{ balmoralId: number }> & { blocked: boolean };

export const useUsers = (): BalmoralUser[] => {
  return [];
};
