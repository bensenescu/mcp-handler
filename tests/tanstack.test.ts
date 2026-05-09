import { describe, expect, it } from "vitest";
import { createTanStackMcpHandler } from "../src/tanstack";

describe("createTanStackMcpHandler", () => {
  it("returns TanStack Start server route handlers", async () => {
    const handlers = createTanStackMcpHandler(() => undefined);

    expect(handlers.GET).toEqual(expect.any(Function));
    expect(handlers.POST).toEqual(expect.any(Function));
    expect(handlers.DELETE).toEqual(expect.any(Function));
  });

  it("passes the TanStack request through to the MCP handler", async () => {
    const { GET } = createTanStackMcpHandler(() => undefined);
    const response = await GET({
      request: new Request("http://localhost/mcp", {
        method: "GET",
      }),
    });

    expect(response.status).toBe(405);
    await expect(response.json()).resolves.toMatchObject({
      jsonrpc: "2.0",
      error: {
        message: "Method not allowed.",
      },
      id: null,
    });
  });
});
