import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";

import type { ViteSentryPluginOptions } from "vite-plugin-sentry";
import viteSentry from "vite-plugin-sentry";

const isDev = () => {
  return process.env.NODE_ENV === "development";
};

const sentryConfig: ViteSentryPluginOptions = {
  authToken: "41ee2a9eab994d21ace386aec2ef9fefddd7c7f4f5684430b691e9847cf7b51c",
  org: "zengjoseph",
  project: "leitcard",
  deploy: {
    env: process.env.NODE_ENV,
  },
  setCommits: {
    auto: true,
    ignoreMissing: true,
  },
  sourceMaps: {
    include: ["./dist"],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Leitcard",
        short_name: "Leitcard",
        description: "A web app that helps you memorize flashcards",
        start_url: ".",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {},
    }),
    !isDev() && viteSentry(sentryConfig),
  ],
  build: {
    sourcemap: true,
  },
});
