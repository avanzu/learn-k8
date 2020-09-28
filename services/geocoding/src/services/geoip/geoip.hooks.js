const { serveFromCache, saveToCache } = require('../../hooks/cache')

module.exports = {
  before: {
    all   : [serveFromCache()],
    find  : [],
    get   : [],
    create: [],
    update: [],
    patch : [],
    remove: []
  },

  after: {
    all   : [saveToCache()],
    find  : [],
    get   : [],
    create: [],
    update: [],
    patch : [],
    remove: []
  },

  error: {
    all   : [],
    find  : [],
    get   : [],
    create: [],
    update: [],
    patch : [],
    remove: []
  }
}
