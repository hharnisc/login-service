import test from 'tape';
import tapSpec from 'tap-spec';
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

test('GET /v1/thetime', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://${host}:${port}/v1/thetime`,
    json: true,
    resolveWithFullResponse: true,
  })
    .then((response) => {
      t.equal(response.statusCode, 200, 'has statusCode 200');
      t.deepEqual(
        Object.keys(response.body).sort(),
        ['time'],
        'response has expected keys'
      );
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

after('after', (t) => {
  disconnectDB();
  t.pass('Disconnected from DB');
  t.end();
});
