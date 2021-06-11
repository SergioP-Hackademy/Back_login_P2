const express = require('express');

const usuario = require('../controller/user.controllers');
const auth = require('../middleware/authentication');
const emptyBodycheck = require('../middleware/emptyBody');

const routes = express.Router();

// Create a user
routes.post('/crear', emptyBodycheck, usuario.register);
// Update a user's role
routes.put('/tierUp', emptyBodycheck, auth.authenticateToken, auth.authenticateAdmin, usuario.tierUp);
// Update a user's info
routes.put('/editar', emptyBodycheck, auth.authenticateToken, usuario.updateUser);
// Deactivate a user
routes.delete('/', auth.authenticateToken, auth.authenticateAdmin, usuario.defuse);
// Find info from one user
routes.get('/lista', auth.authenticateToken, usuario.findOne);
// Find info from all users
routes.get('/listaAll', auth.authenticateToken, usuario.findAll);

module.exports = routes;
