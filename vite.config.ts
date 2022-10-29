import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment'
import { resolve } from 'path'

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/api/': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        secure: false
      }
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    outDir: 'dist',
    commonjsOptions: {
      esmExternals: true,
    },
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
    EnvironmentPlugin('all')
  ],
});