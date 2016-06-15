import test from 'tape';
import tapSpec from 'tap-spec';
import jwt from 'jsonwebtoken';
import requestPromise from 'request-promise';
import retryPromise from 'retry-promise';
import rethinkdb from 'rethinkdb';
import rethinkdbInit from 'rethinkdb-init';
rethinkdbInit(rethinkdb);

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

const before = test;
const after = test;

const userData = {
  email: 'test@test.com',
  emails: ['test@test.com'],
  providers: {
    twitter: {
      scope: 'write',
    },
  },
  roles: ['read'],
};

let connection;
let userId;
const refreshToken = '1234';
const host = process.env.HOST || 'login';
const port = process.env.PORT || 8080;

const config = {
  host: process.env.RETHINKDB_SERVICE_HOST || 'rethinkdb',
  port: 28015,
  db: 'auth',
};
const tableConfig = [
  'users',
  'sessions',
];
const secret = process.env.JWT_SECRET;

const connectDB = () => (
  rethinkdb.init(config, tableConfig)
    .then((conn) => {
      conn.use(config.db);
      connection = conn;
    })
);

const disconnectDB = () => {
  if (connection) {
    connection.close();
  }
};

const populateDB = () => (
  rethinkdb.table('users')
    .insert(userData)
    .run(connection)
  .then((result) => {
    userId = result.generated_keys[0];
  })
  .then(() => (
    rethinkdb.table('sessions')
      .insert({
        userId,
        refreshToken,
      })
      .run(connection)
  ))
);

const resetDB = () => (
  rethinkdb.table('users')
    .delete()
    .run(connection)
);

before('before', (t) => {
  const healthCheck = (attempt) => {
    if (attempt > 1) {
      t.comment('health check failed retrying...');
    }
    return requestPromise({
      method: 'GET',
      uri: `http://${host}:${port}/health`,
      json: true,
      resolveWithFullResponse: true,
    }).then((response) => {
      if (response.statusCode !== 200) {
        throw new Error('Health Check Failed');
      }
    });
  };
  return retryPromise({ max: 5, backoff: 5000 }, healthCheck)
    .then(() => connectDB())
    .then(() => {
      t.pass('Connect To SUT and Database');
      t.end();
    })
    .catch((error) => t.fail(error));
});

test('POST /v1/logout', (t) => {
  populateDB()
    .then(() => (
      requestPromise({
        method: 'POST',
        uri: `http://${host}:${port}/v1/logout`,
        body: {
          userId,
          refreshToken,
        },
        json: true,
        resolveWithFullResponse: true,
      })
    ))
    .then((response) => {
      t.equal(response.statusCode, 200, 'statusCode: 200');
      t.deepEqual(response.body, {}, 'response is empty');
    })
    .then(() => (
      rethinkdb.table('sessions')
        .count()
        .run(connection)
        .then((value) => {
          t.equal(value, 0, 'refresh token removed from db');
        })
    ))
    .catch((error) => t.fail(error))
    .then(() => resetDB())
    .then(() => t.end());
});

test('POST /v1/login - existing user', (t) => {
  populateDB()
    .then(() => (
      requestPromise({
        method: 'POST',
        uri: `http://${host}:${port}/v1/login`,
        body: {
          email: userData.email,
          provider: 'twitter',
          providerInfo: userData.providers.twitter,
          roles: userData.roles,
        },
        json: true,
        resolveWithFullResponse: true,
      })
    ))
    .then((response) => {
      t.equal(response.statusCode, 200, 'statusCode: 200');
      t.deepEqual(
        Object.keys(response.body).sort(),
        ['token', 'user'],
        'response has expected keys'
      );
      t.deepEqual(
        response.body.user,
        Object.assign({}, userData, { id: userId }),
        'response body has expected user'
      );
      return new Promise((resolve, reject) => {
        jwt.verify(response.body.token.accessToken, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            t.equal(decoded.userId, userId, 'token has expected payload');
            t.deepEqual(decoded.roles, userData.roles, 'token has expected roles in payload');
            resolve(response.body.token.refreshToken);
          }
        });
      });
    }).then((testRefreshToken) => (
      rethinkdb.table('sessions')
        .filter({
          userId,
          refreshToken: testRefreshToken,
        })
        .count()
        .run(connection)
        .then((value) => {
          t.equal(value, 1, 'refresh token stored in db');
        })
    ))
    .catch((error) => t.fail(error))
    .then(() => resetDB())
    .then(() => t.end());
});

test('POST /v1/login - new user', (t) => {
  const email = 'another@test.com';
  const providers = {
    google: userData.providers.twitter,
  };
  const roles = userData.roles;
  populateDB()
    .then(() => (
      requestPromise({
        method: 'POST',
        uri: `http://${host}:${port}/v1/login`,
        body: {
          email: 'another@test.com',
          provider: 'google',
          providerInfo: userData.providers.twitter,
          roles: userData.roles,
        },
        json: true,
        resolveWithFullResponse: true,
      })
    ))
    .then((response) => {
      t.equal(response.statusCode, 200, 'statusCode: 200');
      t.deepEqual(
        Object.keys(response.body).sort(),
        ['token', 'user'],
        'response has expected keys'
      );
      t.deepEqual(
        Object.assign({}, response.body.user, { id: 'random' }),
        {
          id: 'random',
          email,
          emails: [email],
          providers,
          roles,
        },
        'response body has expected user'
      );
      return new Promise((resolve, reject) => {
        jwt.verify(response.body.token.accessToken, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            t.equal(
              decoded.userId,
              response.body.user.id,
              'token has expected payload'
            );
            t.deepEqual(
              decoded.roles,
              response.body.user.roles,
              'token has expected roles in payload'
            );
            resolve(response);
          }
        });
      });
    }).then((response) => (
      rethinkdb.table('sessions')
        .filter({
          userId: response.body.user.id,
          refreshToken: response.body.token.refreshToken,
        })
        .count()
        .run(connection)
        .then((value) => {
          t.equal(value, 1, 'refresh token stored in db');
        })
    ))
    .catch((error) => t.fail(error))
    .then(() => resetDB())
    .then(() => t.end());
});

after('after', (t) => {
  disconnectDB();
  t.pass('Disconnected from DB');
  t.end();
});
