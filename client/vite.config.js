import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { runtimeEnv } from "vite-plugin-runtime";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), runtimeEnv()],
  };
});
