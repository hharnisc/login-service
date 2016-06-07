import { auth, userConfig } from '../src/config';
jest.autoMockOff();
require.requireActual('bluebird');
const requestRetryPromise = jest.genMockFromModule('request-retry-promise');
jest.autoMockOn();


const authReject = () => (
  new Promise((resolve) => (
    resolve({
      status: 200,
      body: {},
    })
  ))
);

const userGet = (email) => (
  new Promise((resolve) => {
    if (email === 'null@test.com') {
      resolve({
        status: 200,
        body: null,
      });
    } else {
      resolve({
        status: 200,
        body: { id: 1 },
      });
    }
  })
);

const userCreate = (user) => (
  new Promise((resolve) => {
    resolve(Object.assign({}, user, { id: 1 }));
  })
);

const authCreate = () => (
  new Promise((resolve) => {
    resolve({
      status: 200,
      body: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expireTime: 100,
      },
    });
  })
);

requestRetryPromise.default.mockImplementation((options = {}) => {
  switch (options.uri) {
    case `${auth.proto}://${auth.host}/${auth.version}/reject`:
      return authReject();
    case `${userConfig.proto}://${userConfig.host}/${userConfig.version}/get`:
      return userGet(options.body);
    case `${userConfig.proto}://${userConfig.host}/${userConfig.version}/create`:
      return userCreate(options.body);
    case `${auth.proto}://${auth.host}/${auth.version}/create`:
      return authCreate();
    default:
      return new Promise((resolve) => resolve());
  }
});

module.exports = requestRetryPromise;
