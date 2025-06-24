import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
<<<<<<< HEAD
  server: {
=======
   server: {
>>>>>>> dd4ceea9580412f63e48f83954cc81115cd37b3f
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    host: '0.0.0.0',
  },
});
