require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const cryptoRandomString = require('crypto-random-string');
const chalk = require('chalk');
const model = require('../models/index');

const { log } = console;

exports.login = async (req, res) => {
  try {
    log(chalk.red.bgWhiteBright.bold('Ruta de login'));
    const { email } = req.body;
    const data = await model.Usuario.findOne({
      where: { email, statusDelete: 'false'},
      attributes: ['id', 'password', 'statusDelete'],
    });
    console.log(data.dataValues);
    if (Object.keys(data).length === 0) {
      res.status(202).send({ message: 'No se encontraron registros, o el usuario esta desactivado' });
    }
    // const compare = await bcrypt.compare(req.body.password, data.password);
    // console.log(typeof compare);
    // console.log(compare);
    if (await bcrypt.compare(req.body.password, data.password)) {
      log(chalk.red.bgWhiteBright.bold('comparacion exitosa de contraseñas'));
      // jwt.sign requiere un plain object, el objeto que retorna sequelize es objeto con prototipo
      // Hacemos una deconstruccion para obtener un plain object userInfo con info de usuario

      const { password, statusDelete, ...userInfo } = data.dataValues;
      //   console.log(userInfo);
      console.log(data.dataValues.password);
      try {
        var userToken = await jwt.sign(
          userInfo,
          process.env.ACCESS_TOKEN_SECRET,
        );
      } catch (error) {
        res.status(500).send({ message: err });
      }

      res.status(200).send({ token: userToken });
    }

    res.status(401).send({ message: 'Contraseña incorrecta' });
  } catch (err) {
    // console.log(err);
    res.status(500).send({ message: err });
  }
};
