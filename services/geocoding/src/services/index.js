const geoip = require('./geoip/geoip.service.js')
const geozip = require('./geozip/geozip.service.js');
const health = require('./health/health.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(geoip)
  app.configure(geozip);
  app.configure(health);
}
