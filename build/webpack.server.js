const baseConfig = require('./webpack.base');
const path = require('path');

module.exports = Object.assign(baseConfig, {
  entry: './src/server.tsx',
  output: {
    path: path.resolve('./dist'),
    filename: 'server.js'
  },
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      baseConfig.module.rules[0],
      {
        test: /.(ts|tsx)$/,
        use: [
          {
            loader: path.resolve(__dirname, './loader/remove-func.js'),
            options: {
              removeFuncs: [  // 删除服务端根本用不到的代码
                'onUnmounted',
                'onMounted',
                'onBeforeMount',
                'onBeforeUnmount',
              ]
            }
          },
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
    ]
  },
})
