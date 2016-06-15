# Login

[![Build Status](https://travis-ci.org/hharnisc/login-service.svg?branch=master)](https://travis-ci.org/hharnisc/login-service)

A login service, built on top of hharnisc/auth and hharnisc/user.

**NOTE: this is a work in progress**

## Table Of Contents

- [Quickstart](#quickstart)
- [Testing](#testing)
- [Running Locally](#running-locally)
- [Deploy Locally](#deploy-locally)
- [Deploy To Production](#deploy-to-production)
- [User Object](#user-object)
- [Auth Token](#auth-token)
- [API](#api)

## Quickstart

Install [docker beta](https://beta.docker.com/)

Do a local deploy

```sh
./local_deploy.sh
```

## Testing

Install [docker toolbox](https://beta.docker.com/) (for CI tests)

```sh
$ cd service
```

Install dependencies

```sh
$ npm install
```

### CI Tests

```sh
$ npm run test
```

### Run Unit Tests

```sh
$ npm run test:jest
```

### Run Unit Tests (and watch for changes)

```sh
$ npm run test:watch
```

### Run Integration Tests

```sh
$ npm run test:integration
```

## Running Locally

```sh
$ cd service
```

Install dependencies

```sh
$ npm install
```

Start the server

```sh
$ npm start
```

## Deploy Locally

Follow [Quickstart](#quickstart) instructions

### Deploy Locally With Hot Reload

```sh
./local_deploy.sh -d
```

### Deploy Locally And Skip Build Step

```sh
./local_deploy.sh -n
```

### Deploy Locally With Hot Reload And Skip Build Step

```sh
./local_deploy.sh -dn
```

## Deploy To Production

TODO

## User Object

```json
{
  "id": "1",
  "email": "someone@xyz.com",
  "emails": ["someoneelse@xyz.com", "someone@xyz.com"],
  "providers": {
    "google": {
      /* google provider data*/
    }
  },
  "roles": ["read", "write", "sudo"]
}
```

## Auth Token

```json
{
  "accessToken": "some.access.token",
  "refreshToken": "some.refreshToken",
  "expireTime": 1465994137309
}
```

## API

### GET /health

A health check

#### request

No parameters

#### response

200 - Empty

### GET /v1/login

Login a user. Creates or updates a user (keyed off of email address) and returns the full user object with a session token to make requests against internal apis.

#### request

- **email** - *email address** - the user's email address
- **provider** - *string* - the source where the user was authenticated
- **providerInfo** - *object* - any metadata to store from the source
- **roles** - *[string]* - a list of roles associated with the user

**Note** roles are only set on the first time the user is seen

#### response

- **user** - *object* - complete user object see [User Object](#user-object)
- **token** - *object* - auth token see [Auth Token](#auth-token)

### GET /v1/logout

Logout a user. Rejects the refresh token for a user so it can't be used to create new access tokens.

#### request

- **userId** - *email address** - user id
- **refreshToken** - *string* - persistent token used to generate an `accessToken`

#### response

200 - Empty
