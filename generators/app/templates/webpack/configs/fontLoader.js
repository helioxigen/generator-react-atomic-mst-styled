module.exports = {
    test: /\.(ttf|eot|woff2?)$/i,
    use: [
        {
            loader: "file-loader",
            options: {
                name: "fonts/[name].[ext]",
            },
        },
    ],
}
