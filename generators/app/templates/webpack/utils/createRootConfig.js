const _ = require("lodash")
const merge = require("webpack-merge")

const { configTypes } = require("../webpack.settings")

const createVarsCompiler = vars => type =>
    _.mapValues(
        { type: () => type, ...vars },
        compileFn => (compileFn ? compileFn(type) : compileFn),
    )

const enrichTplFn = (tplFn, vars) => {
    const compile = createVarsCompiler(vars)

    return type => tplFn(compile(type))
}

const generateConfigByType = (configTplFn, vars) => {
    const withVars = enrichTplFn(configTplFn, vars)

    return _.mapValues(_.values(configTypes), withVars)
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
