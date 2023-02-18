require('dotenv').config()
const env = process.env

const local = {
  "username": env.DB_USERNAME,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOSTNAME,
  "port": env.DB_PORT,
  "dialect": "mysql"
}

const development = {
  "username": env.DB_USERNAME,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOSTNAME,
  "port": env.DB_PORT,
  "dialect": "mysql"
}

const production = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOSTNAME,
  "port": process.env.DB_PORT,
  "dialect": "mysql"
}

module.exports = { development, production, local };
