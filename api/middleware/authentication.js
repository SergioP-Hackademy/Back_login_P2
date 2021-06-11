/* eslint-disable consistent-return */
require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');

// Se revisa que el token sea valido ademas de pasar la informacion de usuario a req.user
// Se verifica si el usuario esta activo, si su contraseña ha cambiado y si esta baneado
exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    if (token == null) return res.sendStatus(401).send({ message: 'No se recibio un token' });

    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403).send({ message: 'Token invalido o expirado' });
      // console.log(user);
      const userData = await Usuario.findByPk(user.id, { attributes: ['statusDelete'] });
      // console.log(userData);
      if (userData.statusDelete) {
        return res.status(403).send({ message: 'Usuario desactivado' });
      }

      req.userId = user.id;
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || 'Error al validar token',
    });
  }
};

// Autenticar que el usuario sea superadmin o admin y que este activo
exports.authenticateAdmin = async (req, res, next) => {
  try {
    const userData = await Usuario.findByPk(req.userId, { attributes: ['role'] });
    if (userData.role !== 'admin') {
      return res.status(403).send({ message: 'No tienes permiso de realizar esta accion' });
    }
    next();
  } catch (e) {
    res.status(500).send({ message: 'Error al validar admin' });
  }
};
