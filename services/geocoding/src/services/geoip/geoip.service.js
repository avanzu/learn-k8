// Initializes the `geoip` service on path `/geoip`
const makeService = require('./geoip.class')
const axios = require('axios')
const hooks = require('./geoip.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    fetch   : axios
  }

  // Initialize our service with any options it requires
  app.use('/geoip', makeService(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('geoip')

  service.hooks(hooks)
}
