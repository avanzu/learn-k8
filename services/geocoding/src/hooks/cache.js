const createCacheKey = require('../util/key-of-context')
const { compose, isEmpty, always,  equals, anyPass, isNil, assoc, assocPath, __,  pathOr } = require('ramda')
const inspect = require('../util/inspect')
const either = require('../util/either')


// eslint-disable-next-line no-unused-vars
const serveFromCache = (generateKey = createCacheKey) => context => new Promise(resolve => {
  const cacheGet = pathOr(always(Promise.resolve(null)), ['app', 'cache', 'get'], context)
  const key = generateKey(context)
  const assignResult = compose(assocPath(['params', 'cached'], key), assoc('result', __, context))
  const useResultAndResolve = compose(resolve, assignResult, inspect('Serving from cache %o'))
  const justResolve = compose(resolve, always(context), inspect('nothing cached, value is %o'))

  cacheGet(key)
    .then(inspect(`Value at key ${key} is %o`))
    .then( 
      either(
        anyPass([isEmpty, isNil]), 
        useResultAndResolve,
        justResolve, 
      )
    )

  //  either(
  //    andThen(anyPass([isEmpty, isNil])),
  //    andThen(justResolve),
  //    andThen(useResultAndResolve),
  //    cacheGet(key)
  //  )

})

const saveToCache = ( generateKey = createCacheKey) => context => new Promise(resolve => {
  const { params, result } = context
  const key = generateKey(context)
  const cacheSet = pathOr(always(Promise.resolve(false)), ['app', 'cache', 'set'], context)
  const saveItem = data => ((!params.cached) && cacheSet(key, data), (!params.cached))
  const saveToCacheAndResolve = compose(resolve, always(context), inspect('saved to cache %o'), saveItem)
  const justResolve = compose(resolve, always(context), inspect('Nothing to store'))

  either(
    anyPass([isNil, isEmpty]),
    saveToCacheAndResolve,
    justResolve,
    result
  )
})

const removeFromCache = (generateKey = createCacheKey) => context => new Promise(resolve => {
  const key = generateKey(context)
  const cacheDel = pathOr(always(Promise.resolve(true)), ['app', 'cache', 'del'], context)
  const cacheHas = pathOr(always(Promise.resolve(false)), ['app', 'cache', 'has'], context)
  const removeItem = () => (cacheDel(key), key)
  const removeAndResolve = compose(resolve, always(context), inspect('removed from cache: %o'), removeItem)
  const justResolve = compose(resolve, always(context), inspect('Nothing to remove.'))

  cacheHas(key).then( 
    either( 
      equals(true), 
      justResolve,
      removeAndResolve, 
      
    )
  )

  // either(
  //   andThen(equals(true)),
  //   andThen(justResolve),
  //   andThen(removeAndResolve),
  //   cacheHas(key)
  // )

})

module.exports =  {
  serveFromCache,
  saveToCache,
  removeFromCache
}