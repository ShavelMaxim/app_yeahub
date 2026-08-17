import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-webpack5', options: {} },
  docs: { autodocs: 'tag' },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.module ??= { rules: [] };
    webpackConfig.module.rules ??= [];
    webpackConfig.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
    });
    webpackConfig.resolve ??= {};
    webpackConfig.resolve.extensions = [...(webpackConfig.resolve.extensions ?? []), '.ts', '.tsx'];
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    return webpackConfig;
  },
};

export default config;
