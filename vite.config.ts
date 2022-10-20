import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000/',
      // '/google/callback/': 'http://localhost:3000/',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/index.tsx',
    },
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
  ],
});
