import { Prisma } from "@prisma/client";
import { prismaMock } from "../../../../db/singleton";
import createUser from "../../../../db/user/create";

test("should create new user ", async () => {
  const user: Prisma.UserCreateInput = {
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    auth0UserId: 1,
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual(user);
});
