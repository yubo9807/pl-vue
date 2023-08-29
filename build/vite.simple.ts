import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: 'plvue/simple.ts',
      fileName() {
        return 'index.cjs';
      },
      formats: ['cjs'],
    },
  },
})
