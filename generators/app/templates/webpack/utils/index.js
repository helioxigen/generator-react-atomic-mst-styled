const _ = require("lodash")

const filterPluginsByType = (type, typePluginsMap = {}, ...otherPlugins) => {
    const isTypePresent = type in typePluginsMap

    if (!isTypePresent) return otherPlugins

    return typePluginsMap[type].concat(otherPlugins)
}

const conditionalEntries = (...entries) => match => {
    const matched = entries.filter(entry => {
        if (!_.isArray(entry)) return true

        const [condition] = entry

        return condition === match
    })

    return _.flatten(matched)
}

module.exports = {
    conditionalEntries,
    filterPluginsByType,
    createRootConfig: require("./createRootConfig"),
}
