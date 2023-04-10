const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve('./dist'),
    filename: 'assets/[name].[fullhash:8].js'
  },
  // devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx"],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname),
    },
  },
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[chunkhash:5]',
              },
            },
          },
          'sass-loader',
        ]
      },
      {
        test: /.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[fullhash:8].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 300,
      cacheGroups: {
        'vue-router': {
          name: 'vue-router',
          test: /[\\/]vue[\\/]router[\\/]/,
          priority: 10,
        },
        vue: {
          name: 'vue',
          test: /[\\/]vue[\\/]/,
          priority: 9,
        },
      }
    }
  }
}
