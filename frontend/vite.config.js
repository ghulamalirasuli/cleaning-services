import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@tanstack/react-query', 'zustand'],
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
