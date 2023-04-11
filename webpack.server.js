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
})
