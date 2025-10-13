import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Permite acesso externo (necessário para Docker)
    port: mode === "development" ? 5173 : 8080,
    watch: {
      usePolling: true, // Necessário para hot reload funcionar no Docker
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
