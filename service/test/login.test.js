jest.unmock('../src/login');
jest.unmock('../src/config');
jest.mock('request-retry-promise');
import requestRetryPromise from 'request-retry-promise';
import login from '../src/login';
import { authConfig, userConfig } from '../src/config';

describe('login', () => {
  it('exists', () => {
    expect(login)
      .not.toEqual({});
  });

  beforeEach(() => {
    requestRetryPromise.mockClear();
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
    const userGetUri = `${userConfig.proto}://${userConfig.host}:${userConfig.port}/${userConfig.version}/get`;
    const userGetBody = { email };
    const userCreateUri = `${userConfig.proto}://${userConfig.host}:${userConfig.port}/${userConfig.version}/create`;
    const userCreateBody = user;
    const authUri = `${authConfig.proto}://${authConfig.host}:${authConfig.port}/${authConfig.version}/create`;
    const authBody = { userId };
    const expectedResponse = {
      statusCode: 200,
      body: {
        token: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          expireTime: 100,
        },
        user: Object.assign({}, user, { id: userId }),
      },
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
            method: 'POST',
            uri: userCreateUri,
            body: userCreateBody,
          });
        expect(requestRetryPromise.mock.calls[2][0])
          .toEqual({
            method: 'POST',
            uri: authUri,
            body: authBody,
          });
        expect(response)
          .toEqual(expectedResponse);
      });
  });

  pit('performs login on existing user', () => {
    const userId = 1;
    const email = 'test@test.com';
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
    const userGetUri = `${userConfig.proto}://${userConfig.host}:${userConfig.port}/${userConfig.version}/get`;
    const userGetBody = { email };
    const userUpdateUri = `${userConfig.proto}://${userConfig.host}:${userConfig.port}/${userConfig.version}/update`;
    const userUpdateBody = Object.assign({}, user, { userId, roles: undefined });
    const authUri = `${authConfig.proto}://${authConfig.host}:${authConfig.port}/${authConfig.version}/create`;
    const authBody = { userId };
    const expectedResponse = {
      statusCode: 200,
      body: {
        token: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          expireTime: 100,
        },
        user: Object.assign({}, user, { id: userId }),
      },
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
            method: 'POST',
            uri: userUpdateUri,
            body: userUpdateBody,
          });
        expect(requestRetryPromise.mock.calls[2][0])
          .toEqual({
            method: 'POST',
            uri: authUri,
            body: authBody,
          });
        expect(response)
          .toEqual(expectedResponse);
      });
  });

  pit('rejects when get user explodes', () => {
    const email = 'reject@test.com';
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
    return login(user)
      .then(() => {
        throw new Error('this should never happen');
      })
      .catch((error) => {
        expect(error.message)
          .toBe('error while getting user');
      });
  });
});
