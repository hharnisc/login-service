import requestRetryPromise from 'request-retry-promise';
import { auth } from './config';

const logout = (options = {}) => {
  const { userId, refreshToken } = options;
  const uri = `${auth.proto}://${auth.host}:${auth.port}/${auth.version}/reject`;
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
