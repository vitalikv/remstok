const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  return {
    mode: env.mode ?? 'development',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'main.[contenthash].js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, './src/template.html'),
        filename: 'index.html',
      }),
      // new CopyPlugin({
      //   patterns: [{ from: './src/img', to: './img' }],
      // }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
      splitChunks: { chunks: 'all' },
    },
    devServer: {
      port: 5210,
    },
  };
};
