const settings = require("../webpack.settings")

module.exports = type => ({
    inject: false,
    template: require("html-webpack-template"),
    appMountId: "app",
    baseHref: settings.urls.baseHref,
    devServer: settings.devServerConfig.public(),
    inlineManifestWebpackName: `manifest-${type}.json`,
})
