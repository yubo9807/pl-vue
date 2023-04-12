const path = require('path');
const baseConfig = require('./webpack.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = Object.assign(baseConfig, {
  entry: './src/main.tsx',
  output: {
    path: path.resolve('./dist'),
    filename: 'assets/[name].[chunkhash:8].js',
  },
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules/,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!server.js'],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[chunkhash:8].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 300,
      cacheGroups: {
        vue: {
          name: 'vue',
          test: /[\\/]vue[\\/]/,
          priority: 9,
        },
      }
    }
  }
})
