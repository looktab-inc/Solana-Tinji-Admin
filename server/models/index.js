'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.js');
const db = {};

const modelPath = process.cwd() + '/server/models/' || __dirname;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/* fs.readdirSync(__dirname) */
fs.readdirSync(modelPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0
      && file !== basename
      && file !== 'index.js'
      && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require('./' + file)(sequelize, Sequelize)
    db[model.name] = model
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
