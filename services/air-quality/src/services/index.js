const measurements = require('./measurements/measurements.service.js')
const geoip = require('./geoip/geoip.service.js')
const geo = require('./geo/geo.service.js')
const latest = require('./latest/latest.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(measurements)
  app.configure(geoip)
  app.configure(geo)
  app.configure(latest);
}
