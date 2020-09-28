const { Unavailable, NotFound } = require('@feathersjs/errors')
const { always, propOr,prop,compose, equals, call } = require('ramda')
const either = require('../../util/either')
const unavailable = errors => new Unavailable('Service unavailable', { errors })
const notFound = message => new NotFound(message)

const alwaysReady = always({ active: true, reason: [] })
const readinessOf = compose(call, propOr(alwaysReady, 'readiness'))
const statusOf = compose(always, call, propOr(alwaysReady, '$status'))


/* eslint-disable no-unused-vars */
module.exports = (options, app) => ({
  find: params => new Promise((resolve, reject) => {

    either(
      compose(equals(true), prop('active')),
      compose(reject, unavailable, prop('reason')),
      compose(resolve, always('ok')),
      readinessOf(app)
    )
  }),
  get: (id, params) => new Promise((resolve, reject) => {

    either(
      equals('status'),
      compose(reject, notFound, always(`${id} does not exist`)),
      compose(resolve, statusOf(app)),
      id
    )
  })
})