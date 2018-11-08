const TerserPlugin = require("terser-webpack-plugin")

module.exports = buildType => {
    const config = {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ],
    }

    if (buildType === "legacy") {
        config.splitChunks = {
            cacheGroups: {
                default: false,
                common: false,
            },
        }
    }

    return config
}
