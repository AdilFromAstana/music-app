import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["a9a8-5-34-127-247.ngrok-free.app"],
  },
  plugins: [react()],
});
