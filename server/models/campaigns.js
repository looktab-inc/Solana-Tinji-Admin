'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Campaign.init({
    title: DataTypes.STRING,
    store_address: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.GEOMETRY('POINT'),
    distance: DataTypes.DOUBLE,
    display_started_at: DataTypes.DATE,
    display_ended_at: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'campaigns',
    modelName: 'campaigns',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return Campaign;
};
