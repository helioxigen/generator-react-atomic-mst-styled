// Webpack.dev.js - developmental builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// Node modules
const merge = require('webpack-merge');
const path = require('path');
const sane = require('sane');
const webpack = require('webpack');

// Webpack plugins
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();

// Config files
const common = require('./webpack.common.js');
const settings = require('./webpack.settings.js');

// Configure the webpack-dev-server
const configureDevServer = buildType => {
  return {
    public: settings.devServerConfig.public(),
    contentBase: path.resolve(__dirname, settings.paths.dist.base),
    host: settings.devServerConfig.host(),
    port: settings.devServerConfig.port(),
    https: Boolean(parseInt(settings.devServerConfig.https())),
    quiet: true,
    hot: true,
    hotOnly: true,
    overlay: true,
    stats: 'errors-only',
    watchOptions: {
      poll: Boolean(parseInt(settings.devServerConfig.poll()))
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

// Configure Image loader
const configureImageLoader = buildType => {
  return {
    test: /\.(png|jpe?g|gif|svg|webp)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'img/[name].[hash].[ext]'
        }
      }
    ]
  };
};

// Development module exports
module.exports = [
  merge(common.legacyConfig, {
    output: {
      filename: path.join('./js', '[name]-legacy.[hash].js'),
      publicPath: settings.devServerConfig.public() + '/'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: configureDevServer(LEGACY_CONFIG),
    module: {
      rules: [configureImageLoader(LEGACY_CONFIG)]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  }),
  merge(common.modernConfig, {
    output: {
      filename: path.join('./js', '[name].[hash].js'),
      publicPath: settings.devServerConfig.public() + '/'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: configureDevServer(MODERN_CONFIG),
    module: {
      rules: [configureImageLoader(MODERN_CONFIG)]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new DashboardPlugin(dashboard.setData)
    ]
  })
];
