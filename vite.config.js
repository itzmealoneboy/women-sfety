import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet'],
  },
  server: {
    port: 5173,
    hmr: true
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "leaflet/dist/leaflet.css";`
      }
    }
  }
})