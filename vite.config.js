import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    host: true,
    // This is crucial for client-side routing
    historyApiFallback: true
  },
  preview: {
    port: 5173,
    host: true,
    // This is crucial for client-side routing in production builds
    historyApiFallback: true
  }
});