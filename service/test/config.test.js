jest.unmock('../src/config');
import { authConfig, userConfig } from '../src/config';

describe('config', () => {
  describe('authConfig', () => {
    it('returns expected config', () => {
      expect(authConfig)
        .toEqual({
          proto: 'http',
          host: 'auth',
          port: '8080',
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
