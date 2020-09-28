const { createHash } = require('crypto')
const {  compose, pathOr, concat, toPairs, join, map } = require('ramda')

const qsFromObject =compose(join('&'), map(join('=')), toPairs)
const queryStringOf = compose(qsFromObject, pathOr({}, ['params', 'query']))
const makeHash = string => createHash('md5').update(string).digest('hex')
const createCacheKey = ({ id, ...context }) =>
  compose(makeHash, concat(`${id}?`), queryStringOf)(context)

module.exports = createCacheKey    