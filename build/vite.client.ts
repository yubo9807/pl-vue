import { defineConfig } from 'vite';
import baseConfig from './vite.base';
import env from '../config/env';

const config = defineConfig({
  base: env.BASE_URL,
  build: {
    outDir: 'dist' + env.DEPLOY_URL,
    rollupOptions: {
      output: {
        manualChunks(url) {
          if (url.includes('/plvue/')) return 'plvue';
        }
      }
    },
  }
})

export default Object.assign(config, baseConfig);
