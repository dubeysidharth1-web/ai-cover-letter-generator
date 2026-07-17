import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = Number(env.SERVER_PORT) || 5179;

  return defineConfig({
    plugins: [react()],
    server: {
      port: 4173,
      proxy: {
        '/api': `http://localhost:${apiPort}`
      }
    }
  });
};
