const _ = require('lodash');
const { compose } = require('lodash/fp');

const concatFull = compose(
  _.compact,
  _.flatten
);

const firstKey = _.flow(
  _.keys,
  _.head
);

const getFirstOptionOfType = (options, types) => {
  const opts = _.pickBy(options, (value, key) => _.includes(types, key) && value);

  return firstKey(opts);
};

module.exports = {
  concatFull,
  getFirstOptionOfType
};
