const path = require("path")
const { devServerConfig, paths } = require("../webpack.settings")

module.exports = {
    public: devServerConfig.public(),
    contentBase: path.resolve(__dirname, paths.dist.base),
    host: devServerConfig.host(),
    port: devServerConfig.port(),
    https: Boolean(parseInt(devServerConfig.https(), 10)),
    // quiet: true,
    hot: true,
    hotOnly: true,
    overlay: true,
    stats: "errors-only",
    watchOptions: {
        poll: Boolean(parseInt(devServerConfig.poll(), 10)),
    },
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
}
