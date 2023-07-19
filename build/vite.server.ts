import { defineConfig } from 'vite';
import baseConfig from './vite.base';

const config = defineConfig({
  build: {
    minify: true,
    ssr: 'src/server.tsx',
    lib: {
      entry: 'src/server.tsx',
      fileName: 'server.js',
      formats: ['cjs'],
    },
  },
})

export default Object.assign(config, baseConfig);
