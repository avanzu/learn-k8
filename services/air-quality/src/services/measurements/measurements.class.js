const { join, pathOr, prop, curry, groupBy, map, path } = require('ramda')
const yesterday = new Date(Date.now() - 86400000).toISOString()
const inspect = require('../../util/inspect')
const resolveCoordinates = require('../../util/coordinates')

const fetchMeasurements = curry((fetch, params, { latitude, longitude, ...props }) =>
  Promise
    .resolve({
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
    })
    .then(inspect('retrieving air quality data'))
    .then(fetch)
    .then(pathOr([], ['data', 'results']))
    .then(map(({ value, unit, coordinates, parameter }) => ({
      type      : 'Feature',
      geometry  : { type: 'Point', coordinates: [ prop('longitude', coordinates), prop('latitude', coordinates) ] },
      properties: { value, unit, parameter }
    })))
    .then(groupBy(path([ 'properties', 'parameter' ])))
    .then(map(features => ({ type: 'FeatureCollection', features })))
    .then(measurements => ({
      origin: {
        type      : 'Feature',
        geometry  : { type: 'Point', coordinates: [longitude, latitude] },
        properties: props
      },
      measurements
    }))
)


// eslint-disable-next-line no-unused-vars
module.exports = ({ fetch }, app) => ({
  find: params => new Promise((resolve, reject) => {
    resolveCoordinates(app, params.query)
      .then(inspect('retrieved coordinates'))
      .then(fetchMeasurements(fetch, params))
      .then(inspect('received air quality data'))
      .then(resolve, reject)
  }),
  get: (id, params) => Promise.resolve({ id, ...params })
})