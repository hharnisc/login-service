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
} from '../src/symbols';
import Router from '../src/Router';
import logout from '../src/logout';

describe('Router', () => {
  it('does exist', () => {
    expect(Router).not.toEqual({});
  });

  it('does have a method to initialize routes', () => {
    const router = new Router();
    expect(router[INIT_ROUTES]).toBeDefined();
  });

  it('does handle /thetime route', (done) => {
    const router = new Router();
    const app = express();
    const time = 1300;
    Date.now = jest.fn().mockReturnValue(time);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(router.router);
    request(app)
      .get('/thetime')
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ time });
      })
      .end(done);
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
      logout.mockImplementation(() => new Promise((resolve, reject) => reject(error)));
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
            .toEqual(400);
          expect(res.body)
            .toEqual({ error });
        })
        .end(done);
    });
  });
});
