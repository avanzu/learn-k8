const { createHash } = require('crypto')
const {  compose, pathOr, concat, toPairs, join, map } = require('ramda')
const inspect = require('./inspect')
const qsFromObject =compose(join('&'), map(join('=')), toPairs)
const queryStringOf = compose(qsFromObject, pathOr({}, ['params', 'query']))
const makeHash = string => createHash('md5').update(string).digest('hex')
const createCacheKey = ({ id, ...context }) =>
  compose(makeHash, inspect('key before hash'), concat(`${id}?`), queryStringOf)(context)

module.exports = createCacheKey    