import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'publish',
    minify: false,
    lib: {
      entry: 'plvue/index.ts',
      fileName() {
        return 'index.cjs';
      },
      formats: ['cjs'],
    },
  },
})
