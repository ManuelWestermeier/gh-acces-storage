import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "docs",
  },
  server: { port: 2189 },
});
