import { defineConfig } from 'vite';
import baseConfig from './vite.base';

const config = defineConfig({
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
