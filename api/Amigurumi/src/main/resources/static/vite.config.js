import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'web-client'),
  server: {
    port: 5173,
    hot: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'web-client/src'),
    },
  },
})
