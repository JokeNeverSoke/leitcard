import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";

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
  ],
});
