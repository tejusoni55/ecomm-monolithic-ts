import { describe, it, expect } from "@jest/globals";
import { api } from "./utils/test-agent";

const unique = Date.now();
const testUser = {
  name: `Test User ${unique}`,
  email: `test${unique}@example.com`,
  password: "password123",
};

describe("Users API", () => {
  let token: string | undefined;

  it("registers a new user", async () => {
    const res = await api().post("/api/v1/users").send(testUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("logs in the user and returns a token", async () => {
    const res = await api().post("/api/v1/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("fetches profile with auth token", async () => {
    const res = await api()
      .get("/api/v1/users/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", testUser.email);
  });
});

