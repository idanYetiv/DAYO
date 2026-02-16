import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libs
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-dates': ['date-fns'],
          // Heavy feature libs — loaded on demand
          'vendor-tiptap': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-character-count',
            '@tiptap/extension-underline',
          ],
          'vendor-export': ['html2canvas'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
})
