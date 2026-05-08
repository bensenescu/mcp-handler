# TanStack Start

`mcp-handler` includes a TanStack Start adapter at `mcp-handler/tanstack`.

The adapter returns handlers in the shape TanStack Start expects for
`server.handlers`: each method receives `{ request }` and returns a Web
`Response`.

## Route example

Create a splat server route so one TanStack route can receive the MCP
streamable HTTP, SSE, and SSE message endpoints.

```ts
// src/routes/api/mcp/$.ts
import { createFileRoute } from "@tanstack/react-router";
import { createMcpHandler } from "mcp-handler/tanstack";
import { z } from "zod";

const mcpHandlers = createMcpHandler(
  (server) => {
    server.registerTool(
      "echo",
      {
        title: "Echo",
        description: "Echo a message.",
        inputSchema: {
          message: z.string(),
        },
      },
      async ({ message }) => ({
        content: [{ type: "text", text: message }],
      })
    );
  },
  {},
  {
    basePath: "/api/mcp",
    redisUrl: process.env.REDIS_URL,
  }
);

export const Route = createFileRoute("/api/mcp/$")({
  server: {
    handlers: mcpHandlers,
  },
});
```

With `basePath: "/api/mcp"`, clients connect to:

```text
http://localhost:3000/api/mcp/mcp
```

The same splat route also covers:

```text
http://localhost:3000/api/mcp/sse
http://localhost:3000/api/mcp/message
```
