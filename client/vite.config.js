import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readFileSync, writeFileSync, copyFileSync } from 'fs'
import { join } from 'path'

function githubPages404() {
  return {
    name: 'github-pages-404',
    writeBundle() {
      const outDir = resolve(__dirname, '../docs')
      const indexPath = join(outDir, 'index.html')
      const notFoundPath = join(outDir, '404.html')
      try {
        const indexContent = readFileSync(indexPath, 'utf-8')
        writeFileSync(notFoundPath, indexContent)
      } catch (err) {
        console.warn('Failed to create 404.html:', err)
      }
    }
  }
}

export default defineConfig({
  root: __dirname,
  appType: 'spa',
  base: '/Todo/',
  plugins: [react(), githubPages404()],
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

