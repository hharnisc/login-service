import requestRetryPromise from 'request-retry-promise';
import { authConfig, userConfig } from './config';

const login = (options = {}) => {
  const {
    email,
    provider,
    providerInfo,
    roles,
  } = options;
  const userGetUri = `${userConfig.proto}://${userConfig.host}:${userConfig.port}/${userConfig.version}/get`;
  const userCreateUri = `${userConfig.proto}://${userConfig.host}:${userConfig.port}/${userConfig.version}/create`;
  const userUpdateUri = `${userConfig.proto}://${userConfig.host}:${userConfig.port}/${userConfig.version}/update`;
  const authConfigUri = `${authConfig.proto}://${authConfig.host}:${authConfig.port}/${authConfig.version}/create`;
  return requestRetryPromise({
    uri: userGetUri,
    body: {
      email,
    },
  })
    .then((response) => response.body)
    .then((user) => {
      if (user) {
        return requestRetryPromise({
          method: 'POST',
          uri: userUpdateUri,
          body: {
            userId: user.id,
            email,
            provider,
            providerInfo,
          },
        });
      }
      return requestRetryPromise({
        method: 'POST',
        uri: userCreateUri,
        body: {
          email,
          provider,
          providerInfo,
          roles,
        },
      });
    })
    .then((response) => response.body)
    .then((user) => (
      requestRetryPromise({
        method: 'POST',
        uri: authConfigUri,
        body: {
          userId: user.id,
        },
      })
      .then((response) => (Object.assign({}, response, {
        body: {
          user,
          token: response.body,
        },
      })))
    ))
    .catch((error) => {
      throw new Error(error.message);
    });
};

export default login;
