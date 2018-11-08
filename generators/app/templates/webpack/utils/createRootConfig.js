const _ = require("lodash")
const merge = require("webpack-merge")

const { configTypes } = require("../webpack.settings")

const createVarsCompiler = vars => type =>
    _.mapValues({ type, ...vars }, compileFn => compileFn(type))

const generateConfigByType = (configTplFn, vars) => {
    const compileVars = createVarsCompiler(vars)

    return _.mapValues(_.values(configTypes), typeName => configTplFn(compileVars(typeName)))
}

const createExtendByType = configs => vars => extendTplFn => {
    const compileVars = createVarsCompiler(vars)
    const configEntries = _.entries(configs)

    return configEntries.map(([type, config]) => merge(config, extendTplFn(compileVars(type))))
}

module.exports = vars => configTplFn => {
    const rootConfig = generateConfigByType(configTplFn, vars)

    return {
        extend: createExtendByType(rootConfig),
    }
}
