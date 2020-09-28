const { join, pathOr, prop, isNil, compose, complement, curry, groupBy } = require('ramda')
const yesterday = new Date(Date.now() - 86400000).toISOString()
const either = require('../../util/either')
const inspect = require('../../util/inspect')
const isIp = compose(complement(isNil), prop('ip')) 

const coordinatesByIp = curry((app, {ip}) =>
  app.service('geoip').get(ip))
  
const coordinatesByCriteria = curry((app ,query) => 
  app.service('geo').find({ query }))

const coordinates = curry((app, query = {}) => 
  either(isIp,  coordinatesByCriteria(app), coordinatesByIp(app), query))


// eslint-disable-next-line no-unused-vars
module.exports = ({ fetch }, app) => ({
  find: params => new Promise((resolve, reject) => {
    coordinates(app, params.query)
      .then(inspect('retrieved coordinates'))
      .then( ({ latitude, longitude }) => ({
        baseURL: 'https://api.openaq.org/v1',
        url    : '/measurements',
        method : 'get',
        headers: {
          accept        : 'application/json',
          'content-type': 'application/json'
        },
        params: {
          coordinates: join(',', [latitude, longitude]),
          radius     : pathOr(10000, ['query', 'radius'], params),
          date_from  : pathOr(yesterday, ['query', 'from'], params)
        }
      }))
      .then(inspect('retrieving air quality data'))
      .then(fetch)
      .then(prop('data'))
      .then(({meta, results}) => ({
        total: prop('found', meta),
        limit: prop('limit', meta),
        data : groupBy(prop('parameter'), results)
      }))
      .then(inspect('received air quality data'))
      .then(resolve, reject)
  }),
  get: (id, params) => Promise.resolve({id, ...params})
})