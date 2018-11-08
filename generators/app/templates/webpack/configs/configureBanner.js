const moment = require("moment")
const git = require("git-rev-sync")

const settings = require("../webpack.settings")
const pkg = require("../../package.json")

module.exports = () => ({
    banner: [
        "/*!",
        ` * @project        ${settings.name}`,
        " * @name           [filebase]",
        ` * @author         ${pkg.author.name}`,
        ` * @build          ${moment().format("llll")} ET`,
        ` * @release        ${git.long()} [${git.branch()}]`,
        ` * @copyright      Copyright (c) ${moment().format("YYYY")} ${settings.copyright}`,
        " *",
        " */",
        "",
    ].join("\n"),
    raw: true,
})
