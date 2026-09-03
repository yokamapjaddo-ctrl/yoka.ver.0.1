import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Capacitor(file://)で動かすため相対パス
  build: { outDir: 'dist', assetsDir: 'assets' },
  server: { host: true, port: 5173 },
});
