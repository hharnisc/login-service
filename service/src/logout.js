import requestRetryPromise from 'request-retry-promise';
import { auth } from './config';

const logout = (options = {}) => {
  const { userId, refreshToken } = options;
  const uri = `${auth.proto}://${auth.host}/${auth.version}/reject`;
  return requestRetryPromise({
    uri,
    body: {
      userId,
      refreshToken,
    },
  });
};

export default logout;
