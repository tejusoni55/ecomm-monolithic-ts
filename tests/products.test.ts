import { describe, it, expect } from "@jest/globals";
import { api } from "./utils/test-agent";

describe("Products API", () => {
  it("lists products (public)", async () => {
    const res = await api().get("/api/v1/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
  });
});

