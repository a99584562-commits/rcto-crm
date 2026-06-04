import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so the build works from any
// GitHub Pages sub-path (user.github.io/rcto-crm/) without extra config.
export default defineConfig({
  base: './',
  plugins: [react()],
})
