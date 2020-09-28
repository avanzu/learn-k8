const {  head, pathOr, map, applyTo, toUpper, compose } = require('ramda')
const inspect = require('../../util/inspect')

const transormations = {
  countryCode: compose(toUpper, pathOr('', ['components', 'country_code'])),
  latitude   : pathOr(NaN, ['geometry', 'lat']),
  longitude  : pathOr(NaN, ['geometry', 'lng']),
  city       : pathOr(null, ['components', 'city']),
  postalCode : pathOr(null, ['components', 'postcode'])
}

const transform = result => map(applyTo(result), transormations)

module.exports = ({ fetch, key }) => ({
  // eslint-disable-next-line no-unused-vars
  find: (params) => Promise.resolve({
    baseURL: 'https://api.opencagedata.com',
    url    : '/geocode/v1/json',
    method : 'get',
    params : { key, q: pathOr('', ['query', 'criteria'], params )},
    headers: {
      accept        : 'application/json',
      'content-type': 'application/json'
    }
  })
    .then(inspect('Fetching geozip info'))
    .then(fetch)
    .then(pathOr([], ['data', 'results']))
    .then(head)
    .then(transform)
    .then(inspect('received response'))
  ,

  // eslint-disable-next-line no-unused-vars
  get: (zipcode, params) => Promise.resolve({
    baseURL: 'https://api.opencagedata.com',
    url    : '/geocode/v1/json',
    method : 'get',
    params : { key, q: zipcode },
    headers: {
      accept        : 'application/json',
      'content-type': 'application/json'
    }
  })
    .then(inspect('Fetching geozip info'))
    .then(fetch)
    .then(pathOr([], ['data', 'results']))
    .then(head)
    .then(transform)
    .then(inspect('received response'))
})