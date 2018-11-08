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
const {
    conditionalEntries,
    configureCleanWebpack,
    configureWorkbox,
    configureBundleAnalyzer,
    tplStrType,
} = require("./utils")

const { LEGACY_CONFIG, MODERN_CONFIG } = require("./index").configTypes

// Production module exports
module.exports = common.extend({
    fileTemplate: tplStrType("[name][type].[chunkhash].js"),
    imageLoader: t => imageLoader(t, true),
    optimization: configureOptimization,
    bundleAnalyzer: configureBundleAnalyzer,
    workbox: configureWorkbox,
    banner: configureBanner,
    cleanWebpack: configureCleanWebpack,
    filterPlugins: (...entries) => conditionalEntries(...entries),
})(vars => ({
    output: {
        filename: path.join("./js", vars.fileTemplate),
    },
    mode: "production",
    devtool: "source-map",
    optimization: vars.optimization,
    module: {
        rules: [vars.imageLoader],
    },
    plugins: vars.filterPlugins(
        [LEGACY_CONFIG, new CleanWebpackPlugin(settings.paths.dist.clean, vars.cleanWebpack)],
        new webpack.BannerPlugin(vars.banner),
        [MODERN_CONFIG, new ImageminWebpWebpackPlugin()],
        [MODERN_CONFIG, new WorkboxPlugin.GenerateSW(vars.workbox)],
        [LEGACY_CONFIG, new SaveRemoteFilePlugin(settings.saveRemoteFileConfig)],
        new BundleAnalyzerPlugin(vars.bundleAnalyzer),
    ),
}))
