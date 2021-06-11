require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const cryptoRandomString = require('crypto-random-string');
const chalk = require('chalk');
const model = require('../models/index');
const random = require('../utils/randomstring');

const { log } = console;

exports.register = async (req, res) => {
  log(chalk.red.bgWhiteBright.bold('Ruta de registro de usuarios'));
  try {
    const { body } = req;
    
    // Revisamos si ya hay un usuario que se haya registrado con esa nombre/contraseña
    const userExist = await model.Usuario.findOne({
      where: {
        email: body.email || ' ',
      },
    });

    if (userExist) {
      return res
        .status(409)
        .send({
          message:
            'Ya existe un usuario registrado con este email',
        });
    }
    // validaciones extras No son completamente necesarias la bd ya lo maneja
    if (
      !body.nombre
      || !body.password
      || !body.email
    ) {
      return res
        .status(400)
        .send({ message: 'Se necesita proporcionar los 3 campos requeridos' });
    }

    // cifrado del password
    body.password = await bcrypt.hash(body.password, 10);

    // generar cadena para codigo
    Object.defineProperty(body, 'codigo', {
      value: random(10),
      writable: true,
      configurable: true,
      enumerable: true,
    });

    // Creamos el usuario
    await model.Usuario.create(body);

    res.status(200).send({ message: 'Usuario registrado correctamentre' });
  } catch (err) {
    // console.log(err);
    res.status(500).send({ message: 'Error al hacer el registro' });
  }
};

exports.defuse = async (req, res) => {
  log(chalk.red.bgWhiteBright.bold('Ruta para dar de baja un user'));
  try {
    const { id, statusDelete = true } = req.query;
    const num = await model.Usuario.update({ statusDelete }, {
      where: { id },
    });
    if (num !== 0) {
      res.send({
        message: `El usuario ha sido  ${(statusDelete == 'true') ? 'desactivate' : 'activate'} successfully!`,
      });
    } else { // cambiar este numero de error
      res.status(400).send({
        message: `El usuario no ha podido ser dado de baja =${id}. `,
      });
    }
  } catch (err) {
    res.status(502).send({
      message: `Ocurrio algun error en la eliminacion =${req.params.id}`,
    });
  }
};

exports.updateUser = async (req, res) => {
  log(chalk.red.bgWhiteBright.bold('Actualizar datos'));
  try {
    const { body } = req;
    if (body.password && body.role)
      res
        .status(403)
        .send({ message: 'No tiene acceso para modificar este parametro '});

    // El campo userId contiene el id del usuario este se asigna en el middleware de autenticacion
    const updatedUser = await model.Usuario.update(body, {
      where: {
        id: req.userId,
      },
    });

    res
      .status(200)
      .send({ message: 'Usuario actualizado con exito', updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error al actualizar usuario' });
  }
};
// ojo en la elevacion de privilegios por defecto cuidado
exports.tierUp = async (req, res) => {
  log(chalk.red.bgWhiteBright.bold('Ruta para elevar privilegios'));
  try {
    const { id } = req.query;
    const { role = 'admin' } = req.body;
    const num = await model.Usuario.update(
      { role: role },
      { where: { id } },
    );
    if (num !== 0) {
      res.send({
        message: `El usuario con el id ${id}  ha cambiado su rol a  ${
          role == 'admin' ? 'Admin' : 'Prospecto'
        } exitosamente!`,
      });
    } else {
      // cambiar este numero de error
      res.status(400).send({
        message: `El usuario no ha podido ser dado de baja =${id}. `,
      });
    }
  } catch (err) {
    res.status(502).send({
      message: `Ocurrio algun error en la eliminacion =${req.params.id}`,
    });
  }
};

exports.findOne = async (req, res) => {
  log(chalk.red.bgWhiteBright.bold('Ruta para ver info personal'));
  try {
    const { id = req.userId } = req.query;
    const data = await model.Usuario.findOne(
      {
        where: { id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'role', 'statusDelete'] },
      },
    );

    if (Object.keys(data).length === 0) {
      res.status(202).send({ message: 'No se encontraron registros para este usuario' });
    } else res.status(200).send({ data });
  } catch (err) {
    res.status(502).send({
      message: `Ocurrio algun error en la eliminacion =${req.params.id}`,
    });
  }
};

exports.findAll = async (req, res) => {
  log(chalk.red.bgWhiteBright.bold('Ruta para ver info personal'));
  try {
    const { statusDelete = false } = req.query;
    const data = await model.Usuario.findAll(
      {
        where: { statusDelete },
        attributes: { exclude: ['updatedAt', 'password', 'role', 'statusDelete'] },
      },
    );

    if (Object.keys(data).length === 0) {
      res.status(202).send({ message: 'No se encontraron registros para este usuario' });
    } else res.status(200).send({ data });
  } catch (err) {
    res.status(502).send({
      message: `Ocurrio algun error en la eliminacion =${req.params.id}`,
    });
  }
};
