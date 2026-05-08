import createMcpRouteHandler, {
  type ServerOptions,
} from "../handler";
import type { Config } from "../handler/mcp-api-handler";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export type TanStackServerRouteHandlerContext = {
  request: Request;
};

export type TanStackMcpHandlers = {
  GET: (context: TanStackServerRouteHandlerContext) => Promise<Response>;
  POST: (context: TanStackServerRouteHandlerContext) => Promise<Response>;
  DELETE: (context: TanStackServerRouteHandlerContext) => Promise<Response>;
};

/**
 * Creates MCP handlers for TanStack Start server routes.
 *
 * Use these handlers inside `createFileRoute(...).server.handlers` on a splat
 * route that can receive `/mcp`, `/sse`, and `/message` under your base path.
 */
export function createTanStackMcpHandler(
  initializeServer:
    | ((server: McpServer) => Promise<void>)
    | ((server: McpServer) => void),
  serverOptions?: ServerOptions,
  config?: Config
): TanStackMcpHandlers {
  const handler = createMcpRouteHandler(
    initializeServer,
    serverOptions,
    config
  );

  return {
    GET: ({ request }) => handler(request),
    POST: ({ request }) => handler(request),
    DELETE: ({ request }) => handler(request),
  };
}

export { createTanStackMcpHandler as createMcpHandler };
