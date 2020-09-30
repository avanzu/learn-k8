const Result = require('folktale/result')
const { curry, prop, compose, split,  complement, isNil } = require('ramda')
const isNotNil = complement(isNil)
const fromPredicate  = curry((predicate, value) => predicate(value) ? Result.Ok(value) : Result.Error(value))

const hasIp          = fromPredicate(compose(isNotNil, prop('ip'))) 
const hasCriteria    = fromPredicate(compose(isNotNil, prop('criteria'))) 
const hasCoordinates = fromPredicate(compose(isNotNil, prop('coordinates'))) 

/**
 * 
 * @param {*} app 
 * @param {*} query 
 * @returns OK|Error
 */
const coordsByIp = curry((app, query) => 
  hasIp(query)
    .map(prop('ip'))
    .map(ip => app.service('geoip').get(ip)))

/**
 * 
 * @param {*} app 
 * @param {*} query 
 * @returns OK|Error
 */  
const coordsByCriteria = curry((app, query) =>
  hasCriteria(query)
    .map(prop('criteria'))
    .map( criteria => app.service('geo').find({ query: {criteria} })))
/**
 * 
 * @param {*} app 
 * @param {*} query 
 * @returns OK|Error
 */
const coordsImmediately = curry((app, query) => 
  hasCoordinates(query)
    .map(compose(split(','),prop('coordinates')))
    .map(([ latitude, longitude ]) => Promise.resolve({ latitude, longitude })))
    
const loadCoordinates = (app, query) => 
  coordsByIp(app, query)
    .fold(coordsByCriteria(app), Result.Ok)
    .fold(coordsImmediately(app), Result.Ok)
    .mapError(() => Promise.reject(new Error('Unable to resolve coordinates')))
    .merge()

module.exports = loadCoordinates