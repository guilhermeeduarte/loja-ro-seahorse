import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'web-client'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  server: {
   port: 5173,
     hot: true,
     proxy: {
       '/api': {
         target: `${CORS_ORIGINS}`,
         changeOrigin: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'web-client/src'),
    },
  },
})