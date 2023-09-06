import { defineConfig } from 'vite';
import baseConfig from './vite.base';
import removeFuncs from './plugins/remove-func';
import noOutput from './plugins/no-output';

const config = defineConfig({
  plugins: [
    noOutput((path) => !/.(ts|tsx)$/.test(path)),  // 服务端只用到 js 文件
    removeFuncs('onMounted', 'onUnmounted', 'onBeforeMount', 'onBeforeUnmount', 'printWarn'),  // 一些不可能触发的钩子
  ],
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    minify: true,
    ssr: 'src/server.ts',
    lib: {
      entry: 'src/server.ts',
      fileName: 'server.js',
      formats: ['cjs'],
    },
  },
})

export default Object.assign(config, baseConfig);
