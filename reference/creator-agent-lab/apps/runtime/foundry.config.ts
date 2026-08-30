import { defineConfig } from "glove-foundry/config";

export default defineConfig({
  server: { host: "127.0.0.1", port: 4141 },
  execution: {
    pollIntervalMs: 100,
    idlePollIntervalMs: 1_000,
    maxConcurrent: 4,
    maxAttempts: 3,
    retryBackoffMs: 2_000
  },
  observability: { maxEvents: 10_000 },
  strictFileRoutes: true
});
