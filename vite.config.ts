import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // allow the API base url to be configured via env variables
  // e.g. VITE_API_URL=http://localhost:5000/api/sensor

  const config: any = {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };

  // during development we can automatically proxy `/api` to the backend
  // to avoid CORS headaches; the target can still be overridden via
  // VITE_API_PROXY_TARGET if necessary.
  if (mode === 'development') {
    config.server = {
      proxy: {
        '/api': {
          target: process.env.VITE_API_PROXY_TARGET || 'http://192.168.1.177:5000',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '/api'),
        },
      },
    };
  }

  return config;
});
