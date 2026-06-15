import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function resolveApiProxyTarget(env: Record<string, string>): string {
  if (env.VITE_API_PROXY_TARGET) {
    return env.VITE_API_PROXY_TARGET;
  }

  const host = env.API_HOST || "localhost";
  const port = env.API_PORT || env.PORT || "8000";

  return `http://${host}:${port}`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = resolveApiProxyTarget(env);

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
