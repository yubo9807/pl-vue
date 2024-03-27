import { defineConfig } from 'vite';
import baseConfig from './vite.base';
import env from '../config/env';

const proxy = {
  '^/api': {
    target: 'http://127.0.0.1:20010',
    changeOrigin: true,
  },
}

const config = defineConfig({
  server: { proxy },
  preview: { proxy },
  base: env.BASE_URL || '/',
  build: {
    // minify: false,
    rollupOptions: {
      output: {
        manualChunks(url) {
          if (url.includes('/core/')) return 'plvue';
          if (url.includes('node_modules')) {
            return url.split('node_modules/')[1].split('/')[0];
          }
        }
      }
    },
  }
})

export default Object.assign(config, baseConfig);
