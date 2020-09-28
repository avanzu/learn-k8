const {
  ServiceReady, 
  ServiceConnecting, 
  ServiceDisconnected, 
} = require('../service-events')
const {toPairs} = require('ramda')
module.exports = app => {
  const state = {}

  app.on(ServiceReady, ({name}) => (
    state[name] = {active: true, reason: `service ${name} is ready.`}
  ))
  app.on(ServiceConnecting, ({name}) => (
    state[name] = {active: false, reason: `service ${name} is connecting.`}
  ))
  app.on(ServiceDisconnected, ({name}) => (
    state[name] = {active: false, reason: `service ${name} is disconnected.`}
  ))
  
  const readiness = () =>
    // eslint-disable-next-line no-unused-vars
    toPairs(state).reduce( (acc, [name, itemState]) => ({ 
      active: acc.active && itemState.active,  
      reason: acc.reason.concat([itemState.reason])
    }) , { active: true, reason: [] })

  const $status = () => state

  Object.assign(app, { readiness, $status })
}