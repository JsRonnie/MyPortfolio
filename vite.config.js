import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/zenquotes to the external ZenQuotes API during development to avoid CORS
    proxy: {
      '/api/zenquotes': {
        target: 'https://zenquotes.io',
        changeOrigin: true,
        secure: true,
        // request random quote from zenquotes
        rewrite: (path) => path.replace(/^\/api\/zenquotes/, '/api/random')
      }
    }
  }
})
