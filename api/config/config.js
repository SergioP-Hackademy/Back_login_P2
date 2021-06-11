require('dotenv').config();

const {
  DB_USERNAME_PRODUCTION, DB_PASSWORD_PRODUCTION,
  DB_DATABASENAME_PRODUCTION, DB_HOST_PRODUCTION } = process.env;

module.exports = {
  development: {
    username: 'postgres',
    password: 'Cronos',
    database: 'backP2',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: '',
    password: '',
    database: '',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: DB_USERNAME_PRODUCTION,
    password: DB_PASSWORD_PRODUCTION,
    database: DB_DATABASENAME_PRODUCTION,
    host: DB_HOST_PRODUCTION,
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
