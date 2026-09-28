import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": fromRoot("./src"),
      // `server-only` throws unless imported from a React Server Components
      // build. Tests call those server modules directly, so stub it out.
      "server-only": fromRoot("./test/server-only-stub.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
