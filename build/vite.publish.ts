import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'publish',
    minify: true,
    lib: {
      entry: 'pvue/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },
})
