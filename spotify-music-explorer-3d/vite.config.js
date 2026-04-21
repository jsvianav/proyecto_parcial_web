import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    proxy: {
      '/spotify-token': {
        target: 'https://accounts.spotify.com',
        changeOrigin: true,
        rewrite: () => '/api/token',
        secure: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('three')) return 'three'
          if (id.includes('@react-three')) return 'react-three'
        },
      },
    },
  },
})
