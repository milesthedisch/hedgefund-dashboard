import { createMocks } from "node-mocks-http";
import { Prisma } from "@prisma/client";
import handleCreate from "../../../../pages/api/user/create";

const TEST_USER: Prisma.UserCreateInput = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@johndoe.com",
  auth0UserId: 1,
  role: "USER",
  activated: false,
  fullName: "John Doe",
  units: 0,
  address: null,
};

describe("/api/user/create", () => {
  test("returns a message with the specified animal", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: TEST_USER,
    });

    await handleCreate(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toMatchObject({
      ...TEST_USER,
    });
  });
});
