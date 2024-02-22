import path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

// const CopyPlugin = require('copy-webpack-plugin');

type Mode = 'development' | 'production';
interface EnvVariables {
  mode: Mode;
}

export default (env: EnvVariables) => {
  const isDev = env.mode === 'development';

  const config: webpack.Configuration = {
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
        favicon: path.resolve(__dirname, './src/assets/favicon/favicon.ico'),
      }),
      new MiniCssExtractPlugin({ filename: 'style.[contenthash].css' }),
      // new CopyPlugin({
      //   patterns: [{ from: './src/img', to: './img' }],
      // }),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
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
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
      port: 5210,
    },
  };

  return config;
};
