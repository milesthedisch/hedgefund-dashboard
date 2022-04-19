import { prismaMock } from "../../../../db/singleton";
import createUser from "../../../../db/user/create";

test("should create new user ", async () => {
  const user = {
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    userId: 1,
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual(user);
});
