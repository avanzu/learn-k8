const { mergeLeft } = require('ramda')
// Initializes the `geoip` service on path `/geoip`
const makeService = require('../../infrastructure/remote-service')
const hooks = require('./geoip.hooks')

module.exports = function (app) {
  const options = mergeLeft(app.get('geocoding'), {
    paginate: app.get('paginate'),
    name    : 'geoip',
    methods : ['get']
  })


  // Initialize our service with any options it requires
  app.use('/geoip', makeService(app, options))

  // Get our initialized service so that we can register hooks
  const service = app.service('geoip')

  service.hooks(hooks)
}
