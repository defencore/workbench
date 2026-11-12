import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/src/data/material-guides.ts"))
            return "material-data";
          if (id.includes("/src/data/projects/")) return "manufacturing-data";
          if (id.includes("/node_modules/three/")) return "three";
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id))
            return "react";
          if (
            id.includes("/src/data/content.ts") ||
            id.includes("/src/data/preparation.ts")
          )
            return "curriculum";
        },
      },
    },
  },
});
