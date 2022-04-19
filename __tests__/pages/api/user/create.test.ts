import { createMocks } from "node-mocks-http";
import handleCreate from "../../../../pages/api/user/create";

const TEST_USER = {
  firstName: "Test",
  lastName: "Test",
  email: "test@test.com",
  userId: 1,
};

describe("/api/user/create", () => {
  test("returns a message with the specified animal", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: TEST_USER,
    });

    await handleCreate(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(TEST_USER);
  });
});
