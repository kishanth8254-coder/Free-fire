import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        topup: resolve(__dirname, 'topup.html'),
        boost: resolve(__dirname, 'boost.html'),
        panel: resolve(__dirname, 'panel.html'),
        tiktok: resolve(__dirname, 'tiktok.html'),
        webdev: resolve(__dirname, 'webdev.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // Redirect admin routes to admin.html in dev
      '/admin-login': {
        target: 'http://localhost:3000/admin.html',
        rewrite: () => '/admin.html'
      },
      '/admin-dashboard': {
        target: 'http://localhost:3000/admin.html',
        rewrite: () => '/admin.html'
      }
    }
  }
});
