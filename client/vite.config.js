import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: __dirname,
  appType: 'spa',
  base: '/Todo/',
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: resolve(__dirname, '../docs'),
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
  },
})

