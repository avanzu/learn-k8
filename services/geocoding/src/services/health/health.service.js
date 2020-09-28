// Initializes the `health` service on path `/health`
const makeService = require('./health.class')
const hooks = require('./health.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/health', makeService(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('health')

  service.hooks(hooks)
}
