import express from 'express';
import {
  INIT_ROUTES,
} from './symbols';
import logout from './logout';

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
      logout({
        userId: req.body.userId,
        refreshToken: req.body.refreshToken,
      })
        .then((response) => res.status(response.status).send(res.body))
        .catch((error) => res.status(400).send({ error }));
    });
  }
}
