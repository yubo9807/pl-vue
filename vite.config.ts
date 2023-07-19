import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './')
    }
  },
  css: {
    modules: {
      generateScopedName: '[local]-[hash:6]',
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(url) {
          if (url.includes('/vue/')) return 'vue';
        }
      }
    },
  }
})