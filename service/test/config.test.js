jest.unmock('../src/config');
import { auth } from '../src/config';

describe('config', () => {
  describe('auth', () => {
    it('returns expected config', () => {
      expect(auth)
        .toEqual({
          proto: 'http',
          host: 'auth',
          version: 'v1',
        });
    });
  });
});
