import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const workerUrl = env.VITE_WORKER_URL

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
    server: workerUrl ? {
      proxy: {
        '/api/data': {
          target: workerUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/data/, '/api/data'),
        },
      },
    } : undefined,
  }
})
