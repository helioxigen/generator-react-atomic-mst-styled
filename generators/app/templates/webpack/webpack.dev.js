// Node modules
const path = require("path")
const webpack = require("webpack")

// Webpack plugins
const Dashboard = require("webpack-dashboard")
const DashboardPlugin = require("webpack-dashboard/plugin")

const dashboard = new Dashboard()

// Config files
const common = require("./webpack.common.js")
const settings = require("./webpack.settings.js")
const { devServer, imageLoader } = require("./configs")
const { conditionalEntries } = require("./utils")

// Development module exports
module.exports = common.extend(type => ({
    mode: "development",
    devServer,
    output: {
        filename: path.join("./js", `[name]${type === "modern" ? "" : `.${type}`}.[hash].js`),
        publicPath: `${settings.devServerConfig.public()}/`,
    },
    module: {
        rules: [imageLoader(type)],
    },
    plugins: conditionalEntries(new webpack.HotModuleReplacementPlugin(), [
        "modern",
        new DashboardPlugin(dashboard.setData),
    ]),
}))
