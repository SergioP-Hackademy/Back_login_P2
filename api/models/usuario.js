'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  };
  Usuario.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    nombre: {
      type: DataTypes.INTEGER,
      validate: {
        isAlpha: true, 
        len: [5, 50],

      },
    },
    codigo: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    sexo: DataTypes.STRING,
    edad:{
      type: DataTypes.INTEGER,
      validate: {
        min: 10,
        max: 90
      }
    },
    statusDelete: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};