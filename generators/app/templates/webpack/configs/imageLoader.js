module.exports = (buildType, isProduction = false) => {
    const config = {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
            {
                loader: "file-loader",
                options: {
                    name: "img/[name].[hash].[ext]",
                },
            },
        ],
    }

    if (buildType === "modern" && isProduction) {
        config.use.push({
            loader: "img-loader",
            options: {
                plugins: [
                    require("imagemin-gifsicle")({
                        interlaced: true,
                    }),
                    require("imagemin-mozjpeg")({
                        progressive: true,
                        arithmetic: false,
                    }),
                    require("imagemin-optipng")({
                        optimizationLevel: 5,
                    }),
                    require("imagemin-svgo")({
                        plugins: [{ convertPathData: false }],
                    }),
                ],
            },
        })
    }

    return config
}
