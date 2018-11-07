// Webpack.prod.js - production builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// Node modules
const git = require('git-rev-sync');
const merge = require('webpack-merge');
const moment = require('moment');
const path = require('path');
const webpack = require('webpack');

// Webpack plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

// Config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure file banner
const configureBanner = () => {
  return {
    banner: [
      '/*!',
      ' * @project        ' + settings.name,
      ' * @name           ' + '[filebase]',
      ' * @author         ' + pkg.author.name,
      ' * @build          ' + moment().format('llll') + ' ET',
      ' * @release        ' + git.long() + ' [' + git.branch() + ']',
      ' * @copyright      Copyright (c) ' +
        moment().format('YYYY') +
        ' ' +
        settings.copyright,
      ' *',
      ' */',
      ''
    ].join('\n'),
    raw: true
  };
};

// Configure Bundle Analyzer
const configureBundleAnalyzer = buildType => {
  if (buildType === LEGACY_CONFIG) {
    return {
      analyzerMode: 'static',
      reportFilename: 'report-legacy.html'
    };
  }
  if (buildType === MODERN_CONFIG) {
    return {
      analyzerMode: 'static',
      reportFilename: 'report-modern.html'
    };
  }
};

// Configure Clean webpack
const configureCleanWebpack = () => {
  return {
    root: path.resolve(__dirname, settings.paths.dist.base),
    verbose: true,
    dry: false
  };
};

// Configure Html webpack
const configureHtml = () => {
  return {
    templateContent: '',
    filename: 'webapp.html',
    inject: false
  };
};

// Configure Image loader
const configureImageLoader = buildType => {
  if (buildType === LEGACY_CONFIG) {
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
  }
  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash].[ext]'
          }
        },
        {
          loader: 'img-loader',
          options: {
            plugins: [
              require('imagemin-gifsicle')({
                interlaced: true
              }),
              require('imagemin-mozjpeg')({
                progressive: true,
                arithmetic: false
              }),
              require('imagemin-optipng')({
                optimizationLevel: 5
              }),
              require('imagemin-svgo')({
                plugins: [{ convertPathData: false }]
              })
            ]
          }
        }
      ]
    };
  }
};

// Configure optimization
const configureOptimization = buildType => {
  if (buildType === LEGACY_CONFIG) {
    return {
      splitChunks: {
        cacheGroups: {
          default: false,
          common: false
        }
      },
      minimizer: [
        new TerserPlugin(configureTerser()),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true
            },
            safe: true,
            discardComments: true
          }
        })
      ]
    };
  }
  if (buildType === MODERN_CONFIG) {
    return {
      minimizer: [new TerserPlugin(configureTerser())]
    };
  }
};

// Configure terser
const configureTerser = () => {
  return {
    cache: true,
    parallel: true,
    sourceMap: true
  };
};

// Configure Workbox service worker
const configureWorkbox = () => {
  let config = settings.workboxConfig;

  return config;
};

// Production module exports
module.exports = [
  merge(common.legacyConfig, {
    output: {
      filename: path.join('./js', '[name]-legacy.[chunkhash].js')
    },
    mode: 'production',
    devtool: 'source-map',
    optimization: configureOptimization(LEGACY_CONFIG),
    module: {
      rules: [configureImageLoader(LEGACY_CONFIG)]
    },
    plugins: [
      new CleanWebpackPlugin(settings.paths.dist.clean, configureCleanWebpack()),
      new webpack.BannerPlugin(configureBanner()),
      new HtmlWebpackPlugin(configureHtml()),
      new WebappWebpackPlugin(configureWebapp()),
      new SaveRemoteFilePlugin(settings.saveRemoteFileConfig),
      new BundleAnalyzerPlugin(configureBundleAnalyzer(LEGACY_CONFIG))
    ]
  }),
  merge(common.modernConfig, {
    output: {
      filename: path.join('./js', '[name].[chunkhash].js')
    },
    mode: 'production',
    devtool: 'source-map',
    optimization: configureOptimization(MODERN_CONFIG),
    module: {
      rules: [configurePostcssLoader(MODERN_CONFIG), configureImageLoader(MODERN_CONFIG)]
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.BannerPlugin(configureBanner()),
      new ImageminWebpWebpackPlugin(),
      new WorkboxPlugin.GenerateSW(configureWorkbox()),
      new BundleAnalyzerPlugin(configureBundleAnalyzer(MODERN_CONFIG))
    ]
  })
];
