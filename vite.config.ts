import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';
const fs = require('fs');
import { resolve } from 'path';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/api/': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
    commonjsOptions: {
      esmExternals: true,
    },
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
  ],
});
