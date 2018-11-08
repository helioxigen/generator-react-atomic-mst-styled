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
module.exports = common.extend(type => ({
    mode: "development",
    devServer,
    output: {
        filename: path.join("./js", tplStrType("[name][type].[hash].js", type)),
        publicPath: `${settings.devServerConfig.public()}/`,
    },
    module: {
        rules: [imageLoader(type)],
    },
    plugins: conditionalEntries(new webpack.HotModuleReplacementPlugin(), [
        MODERN_CONFIG,
        new DashboardPlugin(dashboard.setData),
    ]),
}))
