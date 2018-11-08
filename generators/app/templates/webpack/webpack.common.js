// Webpack.common.js - common webpack config

// Webpack plugins
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ManifestPlugin = require("webpack-manifest-plugin")
const WebpackNotifierPlugin = require("webpack-notifier")

const { fontLoader, babelLoader, configureManifest, configureHtmlTemplate } = require("./configs")
const { createRootConfig } = require("./utils")

const { settings, packageJson: pkg } = require("./index")

// Configure Entries
// const configureEntries = () =>
//     _.mapValues(settings.entries, value => path.resolve(__dirname, settings.paths.src.js + value))

module.exports = createRootConfig(type => ({
    name: pkg.name,
    entry: "./src/index.jsx",
    resolve: {
        extensions: [".js", ".jsx"],
    },
    output: {
        path: settings.paths.dist.base,
        publicPath: settings.urls.publicPath,
    },
    module: {
        rules: [fontLoader, babelLoader(type)],
    },
    plugins: [
        new HtmlWebpackPlugin(configureHtmlTemplate(type)),
        new CopyWebpackPlugin(settings.copyWebpackConfig),
        new ManifestPlugin(configureManifest(type)),
        new WebpackNotifierPlugin({
            title: "Webpack",
            excludeWarnings: true,
            alwaysNotify: true,
        }),
    ],
}))
