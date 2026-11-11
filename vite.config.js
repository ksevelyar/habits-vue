import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['habits.localhost'],
    port: 3000,
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
