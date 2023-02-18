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
    address: DataTypes.STRING,
    description: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    distance: DataTypes.DOUBLE,
    display_started_at: DataTypes.DATE,
    display_ended_at: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'campaigns',
    modelName: 'campaign',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return Campaign;
};
