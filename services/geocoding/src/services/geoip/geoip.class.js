const { prop, compose, toUpper,applyTo, map, propOr } = require('ramda')
const inspect = require('../../util/inspect')

const transormations = {
  countryCode: compose(toUpper, propOr('', ['country_code'])),
  latitude   : propOr(NaN, 'latitude'),
  longitude  : propOr(NaN, 'longitude'),
  city       : propOr(null, 'city'),
  postalCode : propOr(null, ['zip_code'])
}

const transform = result => map(applyTo(result), transormations)


module.exports = ({ fetch }) => ({
  // eslint-disable-next-line no-unused-vars
  get: (ip, params) => Promise.resolve({
    baseURL: 'https://freegeoip.app/json',
    url    : `/${ip}`,
    method : 'get',
    headers: {
      accept        : 'application/json',
      'content-type': 'application/json'
    }
  })
    .then(inspect('Sending geoip request'))
    .then(fetch)
    .then(prop('data'))
    .then(transform)
    .then(inspect('Received geoip response'))
    .catch(inspect('error occurred'))
})