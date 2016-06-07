jest.unmock('../src/config');
import { auth, userConfig } from '../src/config';

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

  describe('userConfig', () => {
    it('returns expected config', () => {
      expect(userConfig)
        .toEqual({
          proto: 'http',
          host: 'user',
          version: 'v1',
        });
    });
  });
});
