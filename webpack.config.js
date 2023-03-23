const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].[fullhash:8].js'
  },
  mode: 'production',
  // devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx"],
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
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
      filename: '[name].[fullhash:8].css',
    }),
  ],
}
