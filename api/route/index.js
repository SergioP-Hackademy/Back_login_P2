const express = require('express');

const routes = express.Router();
const usuario = require('../route/user.routes');
const login = require('../route/login.routes');
// Tree routes

routes.use('/home', usuario);
routes.use('/login', login);

module.exports = routes;
