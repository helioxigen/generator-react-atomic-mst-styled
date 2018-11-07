const { compact, flatten } = require('lodash');
const { compose } = require('lodash/fp');

export const concatFull = compose(
  compact,
  flatten
);
