import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://omnitix-3rc3yup9u-tusharegards-projects.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
