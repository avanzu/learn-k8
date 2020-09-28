const eventLogger = require('./event-logger')
const redis = require('./redis')

module.exports = app => {
  app.configure(eventLogger)
  app.configure(redis)
}