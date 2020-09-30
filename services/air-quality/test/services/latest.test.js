const app = require('../../src/app')

describe('\'latest\' service', () => {
  it('registered the service', () => {
    const service = app.service('latest')
    expect(service).toBeTruthy()
  })
})
