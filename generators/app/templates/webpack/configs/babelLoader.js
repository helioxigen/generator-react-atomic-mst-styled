const { browserslist } = require.resolve("package.json", { paths: __dirname })

// Configure Babel loader
module.exports = type => ({
    test: /\.jsx?$/,
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
                            browsers: browserslist[type],
                        },
                    },
                ],
                "@babel/preset-react",
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
