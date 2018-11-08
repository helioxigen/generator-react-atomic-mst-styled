const path = require("path")
const settings = require("../webpack.settings")

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

module.exports = {
    babelLoader: require("./babelLoader"),
    fontLoader: require("./fontLoader"),
    imageLoader: require("./imageLoader"),
    devServer: require("./devServer"),
    configureManifest: require("./configureManifest"),
    configureBanner: require("./configureBanner"),
    configureOptimization: require("./configureOptimization"),
    configureHtmlTemplate: require("./configureHtmlTemplate"),
    configureBundleAnalyzer,
    configureCleanWebpack,
    configureWorkbox,
}
