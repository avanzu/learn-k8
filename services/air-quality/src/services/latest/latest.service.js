const axios = require('axios')
// Initializes the `latest` service on path `/latest`
const makeService = require('./latest.class')
const hooks = require('./latest.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    fetch   : axios
  }

  // Initialize our service with any options it requires
  app.use('/latest', makeService(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('latest')

  service.hooks(hooks)
}
