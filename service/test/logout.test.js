jest.unmock('../src/logout');
jest.unmock('../src/config');
jest.mock('request-retry-promise');
import requestRetryPromise from 'request-retry-promise';
import logout from '../src/logout';
import { auth } from '../src/config';

describe('logout', () => {
  it('exists', () => {
    expect(logout)
      .not.toEqual({});
  });

  pit('does logout a user with a token', () => {
    const userId = 1;
    const refreshToken = 'refreshToken';
    const uri = `${auth.proto}://${auth.host}/${auth.version}/reject`;
    const body = {
      userId,
      refreshToken,
    };
    const expectedResponse = {
      status: 200,
      body: {},
    };
    return logout({ userId, refreshToken })
      .then((response) => {
        expect(requestRetryPromise)
          .toBeCalledWith({
            uri,
            body,
          });
        expect(response)
          .toEqual(expectedResponse);
      });
  });
});
