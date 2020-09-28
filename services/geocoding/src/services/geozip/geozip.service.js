// Initializes the `geozip` service on path `/geozip`
const makeService = require('./geozip.class')
const axios = require('axios')
const hooks = require('./geozip.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    fetch   : axios,
    key     : app.get('openCageKey')
  }

  // Initialize our service with any options it requires
  app.use('/geozip', makeService(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('geozip')

  service.hooks(hooks)
}
