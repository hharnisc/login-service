import express from 'express';
import {
  INIT_ROUTES,
  CALC_MISSING_REQ_PARAMS,
} from './symbols';
import logout from './logout';
import login from './login';

export default class Router {
  constructor() {
    this.router = new express.Router();
    this[INIT_ROUTES]();
  }

  [INIT_ROUTES]() {
    this.router.get('/thetime', (req, res) => res.status(200).send({
      time: Date.now(),
    }));

    this.router.post('/logout', (req, res) => {
      this[CALC_MISSING_REQ_PARAMS](req, ['userId', 'refreshToken'])
        .then(() => (
            logout({
              userId: req.body.userId,
              refreshToken: req.body.refreshToken,
            })
          )
        )
        .then((response) => res.status(response.status).send(response.body))
        .catch((error) => res.status(400).send({ error }));
    });

    this.router.post('/login', (req, res) => {
      login({
        email: req.body.email,
        provider: req.body.provider,
        providerInfo: req.body.providerInfo,
        roles: req.body.roles,
      })
        .then((response) => res.status(200).send(response.body));
    });
  }

  [CALC_MISSING_REQ_PARAMS](req, params = []) {
    return new Promise((resolve, reject) => {
      const missingParams = params.filter((param) => {
        if (param in req.body) {
          return undefined;
        }
        return true;
      });
      if (missingParams.length) {
        reject(`Missing Param(s): ${missingParams.join(', ')}`);
      } else {
        resolve();
      }
    });
  }
}
