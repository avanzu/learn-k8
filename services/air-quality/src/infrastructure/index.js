const eventLogger = require('./event-logger')
const health = require('./health')
//const redis = require('./redis')

module.exports = app => {
  app.configure(health)
  app.configure(eventLogger)
//   app.configure(redis)
}