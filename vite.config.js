import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tailwind runs via its Vite plugin; an empty inline config stops Vite from
  // walking up the directory tree and picking up an unrelated postcss.config.js.
  css: { postcss: {} },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
