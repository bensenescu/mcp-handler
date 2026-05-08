# TanStack Start

`@bensenescu/mcp-handler` includes a TanStack Start adapter at
`@bensenescu/mcp-handler/tanstack`.

The adapter returns handlers in the shape TanStack Start expects for
`server.handlers`: each method receives `{ request }` and returns a Web
`Response`.

## Route example

Create a splat server route so one TanStack route can receive the MCP
streamable HTTP, SSE, and SSE message endpoints.

```ts
// src/routes/api/mcp/$.ts
import { createFileRoute } from "@tanstack/react-router";
import { createMcpHandler } from "@bensenescu/mcp-handler/tanstack";
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

## Test this package locally in another project

From this package checkout, build and pack the package:

```bash
pnpm install
pnpm build
pnpm pack
```

`pnpm pack` prints the tarball filename to install in your app.

In your TanStack Start project, install that tarball by absolute path, replacing
the filename with the one printed by `pnpm pack`:

```bash
pnpm add /absolute/path/to/package.tgz
pnpm add @modelcontextprotocol/sdk@1.26.0 zod
```

Then add the route shown above, start your TanStack app, and test the MCP
endpoint with an MCP client. For example, if your app runs on port `3000`:

```bash
npx -y mcp-remote http://localhost:3000/api/mcp/mcp
```

You can also point any Streamable HTTP MCP client at:

```text
http://localhost:3000/api/mcp/mcp
```

If you change `@bensenescu/mcp-handler`, run `pnpm build && pnpm pack` again
in this checkout, then reinstall the new tarball in the TanStack project.
