const moment = require("moment")
// const git = require("git-rev-sync")

const {
    settings,
    packageJson: { author },
} = require("../index")

module.exports = () => ({
    banner: [
        "/*!",
        ` * @project        ${settings.name}`,
        " * @name           [filebase]",
        ` * @author         ${author.name}`,
        ` * @build          ${moment().format("llll")} ET`,
        // ` * @release        ${git.long()} [${git.branch()}]`,
        ` * @copyright      Copyright (c) ${moment().format("YYYY")} ${settings.copyright}`,
        " *",
        " */",
        "",
    ].join("\n"),
    raw: true,
})
