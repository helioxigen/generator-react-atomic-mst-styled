const _ = require("lodash")
const { MODERN_CONFIG } = require("../index").configTypes

const typePostfix = type => (type === MODERN_CONFIG ? "" : `.${type}`)

const tplStrType = (str = "") => type => str.replace("[type]", typePostfix(type))

const compactMap = _.flow(
    _.map,
    _.compact,
)

const conditionalEntries = match => (...entries) =>
    compactMap(entries, entry => {
        if (!_.isArray(entry)) return entry

        const [condition, value] = entry

        return condition === match && value
    })

module.exports = {
    tplStrType,
    conditionalEntries,
    createRootConfig: require("./createRootConfig"),
}
