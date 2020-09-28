const logger = require('../logger')
const { ServiceConnecting, ServiceReady, ServiceDisconnected, ServiceError } = require('./service-events')

module.exports = app => {
  app.on(ServiceConnecting, (info) => logger.info(ServiceConnecting, info))
  app.on(ServiceReady, (info) => logger.info(ServiceReady, info))
  app.on(ServiceDisconnected, (info) => logger.warn(ServiceDisconnected, info))
  app.on(ServiceError, (info) => logger.error(ServiceError, info))
}