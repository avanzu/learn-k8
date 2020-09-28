const io = require('socket.io-client')
const { v4: uuid } = require('uuid')
const socketio = require('@feathersjs/socketio-client')
const feathers = require('@feathersjs/feathers')
const { difference, omit, defaultTo, curry } = require('ramda')
const { paramsForServer } = require('feathers-hooks-common')
const { ServiceConnecting, ServiceReady, ServiceError, ServiceDisconnected } = require('../service-events')

const without = difference(['find', 'get', 'update', 'remove', 'patch', 'create'])
const withAdditional = params => 
  paramsForServer(defaultTo({}, params), 'authenticated', 'user', 'correlationId')

const makeService = (app, { name, host, port, path = '/socket.io', namespace = 'common', timeout = 5000, methods = ['find', 'get', 'update', 'remove', 'patch', 'create'] }) => {

  const url = `http://${host}:${port}`
  const socket = io(url, { path })
  const client = feathers()

  app.emit(ServiceConnecting, { name, url })

  socket
    .on('connect', () => app.emit(ServiceReady, { name, url }))
    .on('connect_error', error => app.emit(ServiceError, { name, url, error }))
    .on('connect_timeout', error => app.emit(ServiceDisconnected, { name, url, error }))
    .on('reconnect_error', error => app.emit(ServiceError, { name, url, error }))
    .on('reconnecting', attempt => app.emit(ServiceConnecting, { name, url, attempt }))
    .on('reconnect_failed', () => app.emit(ServiceError, { name, url, error: new Error('Giving up') }))


  client.configure(socketio(socket, { name, url, timeout }))

  return omit(without(methods), {
    $client   : client,
    $id       : uuid(),
    $name     : name,
    $remote   : true,
    $namespace: namespace,
    find      : (params) => client.service(name).find(withAdditional(params)),
    get       : (id, params) => client.service(name).get(id, withAdditional(params)),
    remove    : (id, params) => client.service(name).remove(id, withAdditional(params)),
    create    : (data, params) => client.service(name).create(data, withAdditional(params)),
    update    : (id, data, params) => client.service(name).update(id, data, withAdditional(params)),
    patch     : (id, data, params) => client.service(name).patch(id, data, withAdditional(params))
  })

}

module.exports = curry(makeService)
