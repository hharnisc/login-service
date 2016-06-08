jest.unmock('../src/config');
import { auth, userConfig } from '../src/config';

describe('config', () => {
  describe('auth', () => {
    it('returns expected config', () => {
      expect(auth)
        .toEqual({
          proto: 'http',
          host: 'auth',
          port: '9090',
          version: 'v1',
        });
    });
  });

  describe('userConfig', () => {
    it('returns expected config', () => {
      expect(userConfig)
        .toEqual({
          proto: 'http',
          host: 'user',
          port: '8080',
          version: 'v1',
        });
    });
  });
});
