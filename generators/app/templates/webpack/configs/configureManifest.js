const {
    manifestConfig: { basePath },
} = require("../webpack.settings")

module.exports = type => ({
    fileName: `manifest-${type}.json`,
    basePath,
    map: file => {
        const nextFile = file

        nextFile.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, "$2")

        return nextFile
    },
})
