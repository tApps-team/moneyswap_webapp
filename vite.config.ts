import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //   sentryVitePlugin({

    //   org: "web3-dev",
    //   project: "bestexchange_front_pattern",
    //   telemetry: true,
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   authToken: import.meta?.env?.SENTRY_AUTH_TOKEN,

    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["/src/tests/setup.ts"],
    include: ["**/?(*.)test.ts?(x)"],
  },

  build: {
    sourcemap: true,
  },
});
