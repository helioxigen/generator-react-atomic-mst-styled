// Webpack.settings.js - webpack settings config

// node modules
require("dotenv").config()
const pkg = require("./package.json")

// Webpack settings exports
// noinspection WebpackConfigHighlighting

const configTypes = {
    LEGACY_CONFIG: "legacy",
    MODERN_CONFIG: "modern",
}

module.exports = {
    configTypes,
    name: pkg.name,
    paths: {
        src: {
            base: "./src/",
            js: "./src/js",
        },
        dist: {
            base: "./build",
            clean: ["./img", "./js"],
        },
    },
    urls: {
        baseHref: "",
        publicPath: "/dist/",
    },
    copyWebpackConfig: [
        {
            from: "./src/js/workbox-catch-handler.js",
            to: "js/[name].[ext]",
        },
    ],
    devServerConfig: {
        public: () => process.env.DEVSERVER_PUBLIC || "http://0.0.0.0:3000",
        host: () => process.env.DEVSERVER_HOST || "0.0.0.0",
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 3000,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: {
        basePath: "./build",
    },
    saveRemoteFileConfig: [
        // {
        //   url: 'https://www.google-analytics.com/analytics.js',
        //   filepath: 'js/analytics.js'
        // }
    ],
    createSymlinkConfig: [
        // {
        //   origin: 'img/favicons/favicon.ico',
        //   symlink: '../favicon.ico'
        // }
    ],
    workboxConfig: {
        swDest: "../sw.js",
        precacheManifestFilename: "js/precache-manifest.[manifestHash].js",
        importScripts: ["/dist/workbox-catch-handler.js"],
        exclude: [/\.(png|jpe?g|gif|svg|webp)$/i, /\.map$/, /^manifest.*\\.js(?:on)?$/],
        globDirectory: "./web/",
        globPatterns: ["offline.html", "offline.svg"],
        offlineGoogleAnalytics: true,
        runtimeCaching: [
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
                handler: "cacheFirst",
                options: {
                    cacheName: "images",
                    expiration: {
                        maxEntries: 20,
                    },
                },
            },
        ],
    },
}
