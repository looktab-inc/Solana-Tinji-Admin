require('dotenv').config()

const config = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOSTNAME,
  "port":process.env.DB_PORT,
  "dialect": require('mysql2')
}

module.exports = config

