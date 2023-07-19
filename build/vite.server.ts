import { defineConfig } from 'vite';
import baseConfig from './vite.base';
import removeFuncs from './plugins/remove-func';
import noOutput from './plugins/no-output';

const config = defineConfig({
  plugins: [
    noOutput((path) => !/.(js|jsx|ts|tsx)$/.test(path)),  // 服务端只用到 js 文件
    removeFuncs('onMounted', 'onUnmounted', 'onBeforeMount', 'onBeforeUnmount'),  // 一些不可能触发的钩子
  ],
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
