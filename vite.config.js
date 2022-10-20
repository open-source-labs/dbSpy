import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
  ],
});
