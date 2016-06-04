jest.autoMockOff();
require.requireActual('bluebird');
const requestRetryPromise = jest.genMockFromModule('request-retry-promise');
jest.autoMockOn();

requestRetryPromise.default.mockImplementation(() => (
  new Promise((resolve) => (
    resolve({
      status: 200,
      body: {},
    })
  ))
));


module.exports = requestRetryPromise;
