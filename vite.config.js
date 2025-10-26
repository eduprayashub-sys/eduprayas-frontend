import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ✅ Production build optimization
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },

  // ✅ Local development setup
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5002", // local backend
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ✅ Ensure proper path resolution in Vercel build
  base: "./",
});