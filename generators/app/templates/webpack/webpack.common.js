// Webpack.common.js - common webpack config

const _ = require("lodash")

// Node modules
const path = require("path")

// Webpack plugins
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ManifestPlugin = require("webpack-manifest-plugin")
const WebpackNotifierPlugin = require("webpack-notifier")

const genConfigsByType = (configTplFn, types) => _.keyBy(types, value => configTplFn(value))

// Config files
const pkg = require("./package.json")
const settings = require("./webpack.settings.js")

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
                            browsers: browserList,
                        },
                    },
                    "@babel/preset-react",
                ],
            ],
            plugins: [
                "react-hot-loader/babel",
                [
                    "@babel/plugin-proposal-decorators",
                    {
                        legacy: true,
                    },
                ],
                [
                    "@babel/plugin-proposal-class-properties",
                    {
                        loose: true,
                    },
                ],
                "@babel/plugin-syntax-dynamic-import",
                [
                    "@babel/plugin-transform-runtime",
                    {
                        regenerator: true,
                    },
                ],
            ],
        },
    },
})

// Configure Entries
const configureEntries = () =>
    _.mapValues(settings.entries, value => path.resolve(__dirname, settings.paths.src.js + value))

// Configure Font loader
const configureFontLoader = () => ({
    test: /\.(ttf|eot|woff2?)$/i,
    use: [
        {
            loader: "file-loader",
            options: {
                name: "fonts/[name].[ext]",
            },
        },
    ],
})

// Configure Manifest
const configureManifest = type => ({
    fileName: `manifest-${type}.json`,
    basePath: settings.manifestConfig.basePath,
    map: file => {
        const nextFile = file

        nextFile.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, "$2")

        return nextFile
    },
})

const { modern: modernConfig, legacy: legacyConfig } = genConfigsByType(
    type => ({
        name: pkg.name,
        entry: configureEntries(),
        output: {
            path: path.resolve(__dirname, settings.paths.dist.base),
            publicPath: settings.urls.publicPath,
        },
        module: {
            rules: [
                configureFontLoader(),
                configureBabelLoader(Object.values(pkg.browserslist[`${type}Browsers`])),
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: require("html-webpack-template"),
                appMountId: "app",
                baseHref: settings.urls.baseHref,
                devServer: settings.devServerConfig.public(),
                inlineManifestWebpackName: `manifest-${type}.json`,
            }),
            new CopyWebpackPlugin(settings.copyWebpackConfig),
            new ManifestPlugin(configureManifest(type)),
            new WebpackNotifierPlugin({
                title: "Webpack",
                excludeWarnings: true,
                alwaysNotify: true,
            }),
        ],
    }),
    ["modern", "legacy"],
)

module.exports = {
    modernConfig,
    legacyConfig,
}
