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

Install [docker toolbox](https://www.docker.com/products/docker-toolbox)

Install redspread (local kubernetes cluster management)

```bash
$ brew tap redspread/spread
$ brew install spread
```

Start Up `localkube`

```bash
$ spread cluster start
```

Do a local deploy

```bash
./local_deploy.sh
```

## Testing

Install [docker toolbox](https://www.docker.com/products/docker-toolbox) (for CI tests)

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

## Running locally with hot reload

TODO - (mostly waiting on docker for mac and localkube to play nice)

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
