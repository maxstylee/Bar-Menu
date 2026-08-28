import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Bar-Menu/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
