import useSWR from "swr";
import { UserTransactions, User } from "@prisma/client";
import { User as Auth0User } from "auth0";

const updateFetch = async ({ url, args }) => {
  let response;

  try {
    response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(args),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error(e);

    if (e.response) {
      const error = new Error("An error occurred while fetching the data.");

      error.message = e.response.statusText;
      error.name = e.response.data.user;

      throw error;
    }

    return await response.json();
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.json();
};

export type BalmoralUser = User &
  Auth0User<{ balmoralId: number }> & { blocked: boolean } & {
    transactions: UserTransactions[];
    totalUnits: number;
  };

export const useUsers = (): BalmoralUser[] => {
  return [];
};

export const useUpdateUser = (args, userShouldUpdate) => {
  return useSWR(
    userShouldUpdate ? { url: "/api/user/update", args: args } : null,
    updateFetch
  );
};
