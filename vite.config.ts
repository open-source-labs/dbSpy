import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/api/': {
        // TODO - vite proxy error
        // Vite is unable to recognize localhost IPv6 equivalent, so have to change target to the loopback address for IPv4 (http://localhost:3000/ -> http://127.0.0.1:3000/)
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true,
        secure: false,
      },
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
