const app = require('../../src/app');

describe('\'geozip\' service', () => {
  it('registered the service', () => {
    const service = app.service('geozip');
    expect(service).toBeTruthy();
  });
});
