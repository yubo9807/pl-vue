const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx"],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname),
    },
  },
  mode: 'production',
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
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[fullhash:8].css',
    }),
  ],
}
