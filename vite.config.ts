import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';
const fs = require('fs');
import path from 'path';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
  server: {
    port: 8080,
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
      input: './src/index.tsx',
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
