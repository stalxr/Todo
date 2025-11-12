import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const frontendRoot = resolve(__dirname, 'frontend')

export default defineConfig({
  root: frontendRoot,
  appType: 'spa',
  base: '/Todo/',
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: resolve(__dirname, 'docs'),
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
  },
})

