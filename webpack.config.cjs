const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      chunkFilename: isProduction
        ? 'assets/[name].[contenthash:8].chunk.js'
        : 'assets/[name].chunk.js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: { loader: 'ts-loader', options: { transpileOnly: !isProduction } },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
          type: 'asset/resource',
          generator: { filename: 'assets/[name].[contenthash:8][ext]' },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public/index.html') }),
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(process.env.API_URL || 'https://api.yeatwork.ru'),
      }),
    ],
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    devServer: {
      port: 3000,
      host: '0.0.0.0',
      historyApiFallback: true,
      hot: true,
      client: { overlay: true },
    },
    optimization: {
      splitChunks: { chunks: 'all' },
      runtimeChunk: 'single',
    },
    performance: { hints: isProduction ? 'warning' : false },
  };
};
