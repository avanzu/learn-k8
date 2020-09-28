const { createClient } = require('redis')
const {defaultTo, tryCatch, compose} = require('ramda')
const tryToParse = tryCatch(JSON.parse, (err, value) => value)
const tryToStringify = tryCatch(JSON.stringify, (err, value) => value)


const {
  ServiceError,
  ServiceConnecting,
  ServiceDisconnected,
  ServiceReady
} = require('../service-events')

module.exports = app => {
  const options = defaultTo({}, app.get('redis'))
  const client = createClient(options)
  const namedOptions = {...options, name: 'redis'}
  app.emit(ServiceConnecting, namedOptions)

  client
    .on('error', error => app.emit(ServiceError, {
      ...namedOptions, error
    }))
    .on('ready', () => app.emit(ServiceReady, namedOptions))
    .on('reconnecting', () => app.emit(ServiceDisconnected, namedOptions))
    .on('end', () => app.emit(ServiceDisconnected, namedOptions))

  const cache = {
    get: (key) => new Promise((resolve, reject) => client.get(key, (err, result) => err ? reject(err) : resolve(tryToParse(result)))),
    set: (key, value) => new Promise((resolve, reject) => client.set(key, tryToStringify(value), (err) => err ? reject(err) : resolve(value))),
    has: (key) => new Promise((resolve, reject) => client.has(key, (err, result) => err ? reject(err) : resolve(result))),
    del: (key) => new Promise((resolve, reject) => client.del(key, (err, result) => err ? reject(err) : resolve(result)))
  }

  Object.assign(app, { cache, redis: client })
}