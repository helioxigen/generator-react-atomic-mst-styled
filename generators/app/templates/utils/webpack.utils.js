const _ = require("lodash");

export const genConfigsByType = (configTplFn, types) =>
  _.keyBy(types, value => configTplFn(value));
