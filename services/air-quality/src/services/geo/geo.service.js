const { mergeLeft } = require('ramda')
// Initializes the `geo` service on path `/geo`
const makeService = require('../../infrastructure/remote-service')
const hooks = require('./geo.hooks')

module.exports = function (app) {
  const options = mergeLeft(app.get('geocoding'), {
    paginate: app.get('paginate'),
    name    : 'geozip',
    methods : ['get', 'find']
  })

  // Initialize our service with any options it requires
  app.use('/geo', makeService(app, options))

  // Get our initialized service so that we can register hooks
  const service = app.service('geo')

  service.hooks(hooks)
}
