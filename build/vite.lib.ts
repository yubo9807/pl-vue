import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: ['core/index'],
      fileName(_format, entryName) {
        return `${entryName}.cjs`;
      },
      formats: ['cjs'],
    },
  },
})
