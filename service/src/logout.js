import requestRetryPromise from 'request-retry-promise';
import { authConfig } from './config';

const logout = (options = {}) => {
  const { userId, refreshToken } = options;
  const uri = `${authConfig.proto}://${authConfig.host}:${authConfig.port}/${authConfig.version}/reject`;
  return requestRetryPromise({
    method: 'POST',
    uri,
    body: {
      userId,
      refreshToken,
    },
  });
};

export default logout;
