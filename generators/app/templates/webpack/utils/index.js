const _ = require("lodash")
const { MODERN_CONFIG } = require("../index").configTypes

const typePostfix = type => (type === MODERN_CONFIG ? "" : `.${type}`)

const tplStrType = (str = "") => type => str.replace("[type]", typePostfix(type))

const conditionalEntries = match => (...entries) =>
    _.flow(
        entries.filter(entry => {
            if (!_.isArray(entry)) return true

            const [condition] = entry

            return condition === match
        }),
        _.flatten,
    )

module.exports = {
    tplStrType,
    conditionalEntries,
    createRootConfig: require("./createRootConfig"),
}
