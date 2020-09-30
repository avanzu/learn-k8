const loadCoordinates = require('../../src/util/coordinates')
describe('coordinate resolver', () => {

  const get = jest.fn().mockResolvedValue({ get: true })
  const find = jest.fn().mockResolvedValue({ find: true })
  const app = {
    service: () => ({ get, find })
  }

  it('should prefer ip', async () => {
    const result = loadCoordinates(app, { ip: '127.0.0.1' })
    await expect(result).resolves.toEqual({get: true})
  })

  it('should then look for criteria', async () => {
    const result =  loadCoordinates(app, { criteria: 'Wuppertal' })
    await expect(result).resolves.toEqual({find: true})
  })

  it('should then look for coordinates', async () => {
    const result =  loadCoordinates(app, { coordinates: '11.2,99.3' })
    await expect(result).resolves.toEqual({latitude: '11.2', longitude: '99.3'})
  })

  it('should reject when coordinates cannot be resolved', async () => {
    const result = loadCoordinates(app, {foo: 'bar'})  
    await expect(result).rejects.toEqual(
      new Error('Unable to resolve coordinates')
    )
        
  })

})