const _ = require("lodash");

const concatFull = _.flow(
  _.flatten,
  _.compact
);

const firstKey = _.flow(
  _.keys,
  _.head
);

function getFirstOptionOfType(types, options) {
  const opts = _.pickBy(
    options,
    (value, key) => _.includes(types, key) && value
  );

  return firstKey(opts);
}

module.exports = {
  concatFull,
  getFirstOptionOfType
};
