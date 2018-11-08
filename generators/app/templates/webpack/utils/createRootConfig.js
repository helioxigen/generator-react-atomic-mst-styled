const _ = require("lodash")
const merge = require("webpack-merge")

const { configTypes } = require("../webpack.settings")

const generateConfigByType = configTplFn => _.mapValues(_.keyBy(configTypes), configTplFn)
const createExtendByType = configs => extendTplFn =>
    _.entries(configs).map(([type, config]) => merge(config, extendTplFn(type)))

module.exports = configTplFn => {
    const rootConfigs = generateConfigByType(configTplFn)

    return {
        extend: createExtendByType(rootConfigs),
    }
}
