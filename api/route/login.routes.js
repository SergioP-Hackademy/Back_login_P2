const express = require('express');

const userlogin = require('../controller/login.controllers');
const emptyBodycheck = require('../middleware/emptyBody');

const routes = express.Router();

// create a user
routes.post('/', emptyBodycheck, userlogin.login);

module.exports = routes;
