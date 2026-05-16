import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The deployed site lives under /leafletdemo/, so asset URLs must be
  // absolute to that subpath instead of relative to the current document URL.
  base: '/leafletdemo/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js'
  }
});
