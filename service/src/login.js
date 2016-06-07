import requestRetryPromise from 'request-retry-promise';
import { auth, userConfig } from './config';

const login = (options = {}) => {
  const {
    email,
    provider,
    providerInfo,
    roles,
  } = options;
  const userGetUri = `${userConfig.proto}://${userConfig.host}/${userConfig.version}/get`;
  const userCreateUri = `${userConfig.proto}://${userConfig.host}/${userConfig.version}/create`;
  const authUri = `${auth.proto}://${auth.host}/${auth.version}/create`;
  return requestRetryPromise({
    uri: userGetUri,
    body: {
      email,
    },
  })
    .then(() => (
      requestRetryPromise({
        uri: userCreateUri,
        body: {
          email,
          provider,
          providerInfo,
          roles,
        },
      })
    ))
    .then((user) => (
      requestRetryPromise({
        uri: authUri,
        body: {
          userId: user.id,
        },
      })
    ))
    .then((token) => token.body)
    .catch((error) => new Error(error));
};

export default login;
