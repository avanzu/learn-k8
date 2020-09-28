const measurements = require('./measurements/measurements.service.js')
const geoip = require('./geoip/geoip.service.js')
const geo = require('./geo/geo.service.js')
const latest = require('./latest/latest.service.js')
const health = require('./health/health.service')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(health)
  app.configure(measurements)
  app.configure(geoip)
  app.configure(geo)
  app.configure(latest)
}
