import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base:"./",
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5002", // ✅ Local backend (development)
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // ✅ Important for Vercel build
  build: {
    outDir: "dist", // default output folder for production
  },
});
