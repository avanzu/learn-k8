const app = require('../../src/app');

describe('\'geo\' service', () => {
  it('registered the service', () => {
    const service = app.service('geo');
    expect(service).toBeTruthy();
  });
});
