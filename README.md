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

## API

### GET /health

A health check

#### request

No parameters

#### response

200 - Empty

### GET /v1/thetime

Get a unix timestamp

#### request

No parameters

#### response

- **time** - *unix timestamp* - current time
