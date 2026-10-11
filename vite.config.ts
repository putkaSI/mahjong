import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// Na GitHub Pages teče igra pod /mahjong/, lokalno pod /.
export default defineConfig(({ command }) => ({
  base: command === "build" ? (process.env.BASE ?? "/mahjong/") : "/",
  build: { target: "es2022", chunkSizeWarningLimit: 900 },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["ikona.svg", "ikona-192.png", "ikona-512.png"],
      manifest: {
        name: "Mahjong",
        short_name: "Mahjong",
        description: "Klasičen Mahjong pasjansa: mirno, brez reklam, deluje brez interneta.",
        lang: "sl",
        display: "standalone",
        orientation: "portrait", // na telefonu pokončno (postavitve so prilagojene); računalnik to prezre
        background_color: "#dccbaa",
        theme_color: "#6b4a2b",
        icons: [
          { src: "ikona-192.png", sizes: "192x192", type: "image/png" },
          { src: "ikona-512.png", sizes: "512x512", type: "image/png" },
          { src: "ikona-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // vse, tudi ozadja in glasba, da igra deluje brez interneta
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2,mp3}"],
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
      },
    }),
  ],
}));
