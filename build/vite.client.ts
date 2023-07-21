import { defineConfig } from 'vite';
import baseConfig from './vite.base';
import env from '../config/env';

const config = defineConfig({
  base: env.BASE_URL,
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks(url) {
          if (url.includes('/vue/')) return 'vue';
        }
      }
    },
  }
})

export default Object.assign(config, baseConfig);
