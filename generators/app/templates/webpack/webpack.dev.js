// Node modules
const path = require("path")
const webpack = require("webpack")

// Webpack plugins
const Dashboard = require("webpack-dashboard")
const DashboardPlugin = require("webpack-dashboard/plugin")

const dashboard = new Dashboard()

// Config files
const common = require("./webpack.common")
const settings = require("./webpack.settings")
const { devServer, imageLoader } = require("./configs")

const { conditionalEntries, tplStrType } = require("./utils")

const { MODERN_CONFIG } = require("./index").configTypes

// Development module exports
module.exports = common.extend({
    fileTemplate: tplStrType("[name][type].[hash].js"),
    imageLoader,
    filterPlugins: (...entries) => conditionalEntries(...entries),
})(vars => ({
    mode: "development",
    devServer,
    output: {
        filename: path.join("./js", vars.fileTemplate),
        publicPath: `${settings.devServerConfig.public()}/`,
    },
    module: {
        rules: [vars.imageLoader],
    },
    plugins: vars.filterPlugins(new webpack.HotModuleReplacementPlugin(), [
        MODERN_CONFIG,
        new DashboardPlugin(dashboard.setData),
    ]),
}))
