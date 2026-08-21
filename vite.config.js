import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Chunk splitting: GSAP and Lenis are large - separating them
    // means the main bundle stays small while they load in parallel.
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          lenis: ['lenis'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
