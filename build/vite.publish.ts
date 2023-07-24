import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'publish',
    minify: false,
    lib: {
      entry: 'pvue/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },
})
