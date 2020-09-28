const app = require('../../src/app')

describe('\'geoip\' service', () => {
  it('registered the service', () => {
    const service = app.service('geoip')
    expect(service).toBeTruthy()
  })
})
