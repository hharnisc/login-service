jest.unmock('../src/logout');
jest.unmock('../src/config');
jest.mock('request-retry-promise');
import requestRetryPromise from 'request-retry-promise';
import logout from '../src/logout';
import { authConfig } from '../src/config';

describe('logout', () => {
  it('exists', () => {
    expect(logout)
      .not.toEqual({});
  });

  pit('does logout a user with a token', () => {
    const userId = 1;
    const refreshToken = 'refreshToken';
    const uri = `${authConfig.proto}://${authConfig.host}:${authConfig.port}/${authConfig.version}/reject`;
    const body = {
      userId,
      refreshToken,
    };
    const expectedResponse = {
      statusCode: 200,
      body: {},
    };
    return logout({ userId, refreshToken })
      .then((response) => {
        expect(requestRetryPromise)
          .toBeCalledWith({
            method: 'POST',
            uri,
            body,
          });
        expect(response)
          .toEqual(expectedResponse);
      });
  });
});
