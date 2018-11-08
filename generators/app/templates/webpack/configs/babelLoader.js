const {
    packageJson: { browserslist },
} = require("../index")

// Configure Babel loader
module.exports = (type, isProduction = false) => ({
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
                            browsers: browserslist[isProduction ? "production" : type],
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
