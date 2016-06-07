jest.unmock('../src/login');
jest.unmock('../src/config');
jest.mock('request-retry-promise');
import requestRetryPromise from 'request-retry-promise';
import login from '../src/login';
import { auth, userConfig } from '../src/config';

describe('login', () => {
  it('exists', () => {
    expect(login)
      .not.toEqual({});
  });

  pit('performs login a new user', () => {
    const userId = 1;
    const email = 'null@test.com';
    const provider = 'google';
    const providerInfo = {
      scope: ['email'],
    };
    const roles = ['admin'];
    const user = {
      email,
      provider,
      providerInfo,
      roles,
    };
    const userGetUri = `${userConfig.proto}://${userConfig.host}/${userConfig.version}/get`;
    const userGetBody = { email };
    const userCreateUri = `${userConfig.proto}://${userConfig.host}/${userConfig.version}/create`;
    const userCreateBody = user;
    const authUri = `${auth.proto}://${auth.host}/${auth.version}/create`;
    const authBody = { userId };
    const expectedResponse = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      expireTime: 100,
    };
    return login(user)
      .then((response) => {
        expect(requestRetryPromise.mock.calls[0][0])
          .toEqual({
            uri: userGetUri,
            body: userGetBody,
          });
        expect(requestRetryPromise.mock.calls[1][0])
          .toEqual({
            uri: userCreateUri,
            body: userCreateBody,
          });
        expect(requestRetryPromise.mock.calls[2][0])
          .toEqual({
            uri: authUri,
            body: authBody,
          });
        expect(response)
          .toEqual(expectedResponse);
      });
  });
});
