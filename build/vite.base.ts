import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '~': resolve(__dirname, '../')
    }
  },
  css: {
    modules: {
      generateScopedName: '[local]-[hash:6]',
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
    },
  },
})