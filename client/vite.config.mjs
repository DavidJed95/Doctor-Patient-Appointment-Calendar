import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    
    sourcemap: true, // Enable source maps for production builds
  },
  plugins: [react()],
  server: {
    open: true,
  },
});