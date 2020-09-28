const app = require('../../src/app')

describe('\'geocoding\' service', () => {
  it('registered the service', () => {
    const service = app.service('geocoding')
    expect(service).toBeTruthy()
  })
})
