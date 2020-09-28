// Initializes the `measurements` service on path `/measurements`
const makeService = require('./measurements.class')
const hooks = require('./measurements.hooks')
const axios = require('axios')
module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    fetch   : axios
  }

  // Initialize our service with any options it requires
  app.use('/measurements', makeService(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('measurements')

  service.hooks(hooks)
}
