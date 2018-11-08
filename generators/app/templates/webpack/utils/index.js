const _ = require("lodash")
const { MODERN_CONFIG } = require("../index").configTypes

const typePostfix = type => (type === MODERN_CONFIG ? "" : `.${type}`)

const tplStrType = (str = "", type) => str.replace("[type]", typePostfix(type));

const conditionalEntries = (...entries) => match => {
    const matched = entries.filter(entry => {
        if (!_.isArray(entry)) return true

        const [condition] = entry

        return condition === match
    })

    return _.flatten(matched)
}

module.exports = {
    tplStrType,
    conditionalEntries,
    createRootConfig: require("./createRootConfig"),
}
