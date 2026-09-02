import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/commercial-finance-profitability-analytics/',
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  build: {
    outDir: '../docs',
    emptyOutDir: false,
    rollupOptions: { input: 'index.html' },
  },
});
