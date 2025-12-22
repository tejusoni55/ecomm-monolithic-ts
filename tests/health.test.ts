import { describe, it, expect } from "@jest/globals";
import { api } from "./utils/test-agent";

describe("Health endpoint", () => {
  it("returns healthy", async () => {
    const res = await api().get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "healthy",
    });
  });
});

