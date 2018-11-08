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

module.exports = createRootConfig({
    babelLoader,
    htmlTemplate: configureHtmlTemplate,
    manifest: configureManifest,
})(vars => ({
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
        rules: [fontLoader, vars.babelLoader],
    },
    plugins: [
        new HtmlWebpackPlugin(vars.htmlTemplate),
        new CopyWebpackPlugin(settings.copyWebpackConfig),
        new ManifestPlugin(vars.manifest),
        new WebpackNotifierPlugin({
            title: "Webpack",
            excludeWarnings: true,
            alwaysNotify: true,
        }),
    ],
}))
