// Webpack.common.js - common webpack config
const LEGACY_CONFIG = "legacy";
const MODERN_CONFIG = "modern";

// Node modules
const path = require("path");
const merge = require("webpack-merge");

// Webpack plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const { strOr } = require("./utils/index.js");

// Config files
const pkg = require("./package.json");
const settings = require("./webpack.settings.js");

// Configure Babel loader
const configureBabelLoader = browserList => ({
  test: /\.js(x?)$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            useBuiltIns: "entry",
            targets: {
              browsers: browserList
            }
          },
          "@babel/preset-react"
        ]
      ],
      plugins: [
        "react-hot-loader/babel",
        [
          "@babel/plugin-proposal-decorators",
          {
            legacy: true
          }
        ],
        [
          "@babel/plugin-proposal-class-properties",
          {
            loose: true
          }
        ],
        "@babel/plugin-syntax-dynamic-import",
        [
          "@babel/plugin-transform-runtime",
          {
            regenerator: true
          }
        ]
      ]
    }
  }
});

// Configure Entries
const configureEntries = () => {
  const entries = {};
  for (const [key, value] of Object.entries(settings.entries)) {
    entries[key] = path.resolve(__dirname, settings.paths.src.js + value);
  }

  return entries;
};

// Configure Font loader
const configureFontLoader = () => ({
  test: /\.(ttf|eot|woff2?)$/i,
  use: [
    {
      loader: "file-loader",
      options: {
        name: "fonts/[name].[ext]"
      }
    }
  ]
});

const getManifestName = type => {
  const type = strOr(type !== "modern" && `-${type}`);

  return `manifest${type}.json`;
};

// Configure Manifest
const configureManifest = type => ({
  fileName: getManifestName(type),
  basePath: settings.manifestConfig.basePath,
  map: file => {
    file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, "$2");
    return file;
  }
});

const { legacyConfig, modernConfig } = genConfig(type => ({
  name: pkg.name,
  entry: configureEntries(),
  output: {
    path: path.resolve(__dirname, settings.paths.dist.base),
    publicPath: settings.urls.publicPath
  },
  module: {
    rules: [configureFontLoader()]
  },
  module: {
    rules: [
      configureBabelLoader(Object.values(pkg.browserslist[`${type}Browsers`]))
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: require("html-webpack-template"),
      appMountId: "app",
      baseHref: settings.urls.baseHref,
      devServer: settings.devServerConfig.public(),
      inlineManifestWebpackName: getManifestName(type),
    })
    new CopyWebpackPlugin(settings.copyWebpackConfig),
    new ManifestPlugin(configureManifest(type)),
    new WebpackNotifierPlugin({
      title: "Webpack",
      excludeWarnings: true,
      alwaysNotify: true
    })
  ]
}), ["modern", "legacy"]);

// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = {
  legacyConfig: legacy,
  modernConfig: merge(modern, baseConfig)
};
