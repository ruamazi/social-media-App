import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target: "https://social-media-app-vercel-gamma.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
