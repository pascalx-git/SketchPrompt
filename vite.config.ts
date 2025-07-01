import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: './media',
  build: {
    outDir: './media',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        sketching: resolve(__dirname, 'media/sketching-app.tsx'),
      },
      output: {
        entryFileNames: 'sketching.js',
        assetFileNames: '[name][extname]',
      }
    },
    sourcemap: false,
    minify: true,
    manifest: false,
    target: 'esnext',
  },
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'media')
    }
  }
}); 