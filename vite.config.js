// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'angular-qr-scanner.onrender.com'  // ← ここを追加
    ]
  }
});
