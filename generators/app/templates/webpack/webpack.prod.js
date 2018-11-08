// Webpack.prod.js - production builds

// Node modules
const webpack = require("webpack")
const path = require("path")

// Webpack plugins
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin")
const SaveRemoteFilePlugin = require("save-remote-file-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")

// Config files
const common = require("./webpack.common")
const settings = require("./webpack.settings")
const { configureOptimization, imageLoader, configureBanner } = require("./configs")
const { conditionalEntries } = require("./utils")

// Configure Bundle Analyzer
const configureBundleAnalyzer = buildType => ({
    analyzerMode: "static",
    reportFilename: `report-${buildType}.html`,
})

// Configure Clean webpack
const configureCleanWebpack = () => ({
    root: path.resolve(__dirname, settings.paths.dist.base),
    verbose: true,
    dry: false,
})

// Configure Workbox service worker
const configureWorkbox = () => {
    const config = settings.workboxConfig

    return config
}

const { LEGACY_CONFIG, MODERN_CONFIG } = require("./index").configTypes

// Production module exports
module.exports = common.extend(type => ({
    output: {
        filename: path.join("./js", `[name]${type === "modern" ? "" : `.${type}`}.[chunkhash].js`),
    },
    mode: "production",
    devtool: "source-map",
    optimization: configureOptimization(type),
    module: {
        rules: [imageLoader(type, true)],
    },
    plugins: conditionalEntries(
        new CleanWebpackPlugin(settings.paths.dist.clean, configureCleanWebpack()),
        new webpack.BannerPlugin(configureBanner()),
        [MODERN_CONFIG, new ImageminWebpWebpackPlugin()],
        [MODERN_CONFIG, new WorkboxPlugin.GenerateSW(configureWorkbox())],
        [LEGACY_CONFIG, new SaveRemoteFilePlugin(settings.saveRemoteFileConfig)],
        new BundleAnalyzerPlugin(configureBundleAnalyzer(type)),
    )(type),
}))
