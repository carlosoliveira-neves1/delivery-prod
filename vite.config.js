import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Prevent dynamic imports from being processed during build
    'import.meta.env.VITE_DISABLE_DYNAMIC_IMPORTS': JSON.stringify('true')
  }
});