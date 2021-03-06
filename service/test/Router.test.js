jest.unmock('../src/Router');
jest.unmock('../src/symbols');
jest.unmock('supertest');
jest.unmock('express');
jest.unmock('body-parser');
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {
  INIT_ROUTES,
  CALC_MISSING_REQ_PARAMS,
} from '../src/symbols';
import Router from '../src/Router';
import logout from '../src/logout';
import login from '../src/login';

describe('Router', () => {
  it('does exist', () => {
    expect(Router).not.toEqual({});
  });

  it('does have a method to initialize routes', () => {
    const router = new Router();
    expect(router[INIT_ROUTES]).toBeDefined();
  });

  describe('CALC_MISSING_REQ_PARAMS', () => {
    it('exists', () => {
      const router = new Router();
      expect(router[CALC_MISSING_REQ_PARAMS]).toBeDefined();
    });

    it('does calculate missing request params', (done) => {
      const params = ['userId'];
      const error = Error(`Missing Param(s): ${params.join(',')}`);
      const router = new Router();
      const req = {
        body: {},
      };
      router[CALC_MISSING_REQ_PARAMS](req, params)
        .catch((actualError) => {
          expect(actualError).toEqual(error);
          done();
        });
    });

    it('does calculate some missing request params', (done) => {
      const userId = 1;
      const params = ['userId', 'another thing'];
      const error = Error(`Missing Param(s): ${params.slice(1, 2).join(',')}`);
      const router = new Router();
      const req = {
        body: {
          userId,
        },
      };
      router[CALC_MISSING_REQ_PARAMS](req, params)
        .catch((actualError) => {
          expect(actualError).toEqual(error);
          done();
        });
    });

    it('does calculate no missing request params', (done) => {
      const userId = 1;
      const password = 'password';
      const params = ['userId', 'password'];
      const router = new Router();
      const req = {
        body: {
          userId,
          password,
        },
      };
      router[CALC_MISSING_REQ_PARAMS](req, params)
        .then(() => done());
    });
  });

  describe('/logout', () => {
    it('does handle route', (done) => {
      const router = new Router();
      const app = express();
      const userId = 1;
      const refreshToken = 'refreshToken';
      logout.mockImplementation(() => new Promise((resolve) => resolve({
        status: 200,
        body: {},
      })));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(router.router);
      request(app)
        .post('/logout')
        .send({ userId, refreshToken })
        .expect((res) => {
          expect(logout)
            .toBeCalledWith({
              userId,
              refreshToken,
            });
          expect(res.status)
            .toEqual(200);
          expect(res.body)
            .toEqual({});
        })
        .end(done);
    });

    it('does handle errors', (done) => {
      const router = new Router();
      const app = express();
      const userId = 1;
      const refreshToken = 'refreshToken';
      const error = 'some error';
      logout.mockImplementation(() => new Promise((resolve, reject) => reject(Error(error))));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(router.router);
      request(app)
        .post('/logout')
        .send({ userId, refreshToken })
        .expect((res) => {
          expect(res.status)
            .toEqual(400);
          expect(res.body)
            .toEqual({ error });
        })
        .end(done);
    });

    it('does handle missing params', (done) => {
      const error = 'Missing Param(s): userId, refreshToken';
      logout.mockImplementation(() => new Promise((resolve) => resolve()));
      const router = new Router();
      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(router.router);
      request(app)
        .post('/logout')
        .expect((res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toEqual({ error });
        })
        .end(done);
    });
  });

  describe('/login', () => {
    it('does handle route', (done) => {
      const router = new Router();
      const app = express();
      const email = 'test@test.com';
      const provider = 'google';
      const providerInfo = {
        scope: ['email'],
      };
      const roles = ['admin'];
      const user = {
        email,
        provider,
        providerInfo,
        roles,
      };
      const token = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expireTime: 100,
      };
      login.mockImplementation(() => new Promise((resolve) => resolve({
        status: 200,
        body: token,
      })));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(router.router);
      request(app)
        .post('/login')
        .send(user)
        .expect((res) => {
          expect(login)
            .toBeCalledWith({
              email,
              provider,
              providerInfo,
              roles,
            });
          expect(res.status)
            .toEqual(200);
          expect(res.body)
            .toEqual(token);
        })
        .end(done);
    });

    it('does handle errors', (done) => {
      const router = new Router();
      const app = express();
      const email = 'test@test.com';
      const provider = 'google';
      const providerInfo = {
        scope: ['email'],
      };
      const roles = ['admin'];
      const user = {
        email,
        provider,
        providerInfo,
        roles,
      };
      const error = 'some error';
      login.mockImplementation(() => new Promise((resolve, reject) => reject(Error(error))));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(router.router);
      request(app)
        .post('/login')
        .send(user)
        .expect((res) => {
          expect(res.status)
            .toEqual(400);
          expect(res.body)
            .toEqual({ error });
        })
        .end(done);
    });

    it('does handle missing params', (done) => {
      const error = 'Missing Param(s): email, provider, providerInfo';
      login.mockImplementation(() => new Promise((resolve) => resolve()));
      const router = new Router();
      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(router.router);
      request(app)
        .post('/login')
        .expect((res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toEqual({ error });
        })
        .end(done);
    });
  });
});
