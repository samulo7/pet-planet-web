// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // 🔴 关键点 1: 必须写 127.0.0.1，不要写 localhost
        target: 'http://127.0.0.1:8080', 
        changeOrigin: true,
        // 🔴 关键点 2: 你的后端路由里本身就有 /api，所以绝对不要加 rewrite!
        // rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})