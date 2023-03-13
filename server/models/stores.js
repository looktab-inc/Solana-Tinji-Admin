'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.payments, {
        as: "payments",
        foreignKey: "store_address",
        onDelete: "cascade",
      })
      this.hasMany(models.campaigns, {
        as: "campaigns",
        foreignKey: "store_address",
        onDelete: "cascade",
      });
    }
  }
  Stores.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.STRING,
    location_address: DataTypes.STRING,
    cover_url: DataTypes.STRING,
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      get() {
        const point =  this.getDataValue("location")
        if (!point) {
          return {
            lng: 0,
            lat : 0
          }
        }
        const coordinates = point['coordinates']
        return {
          lng: coordinates[0],
          lat : coordinates[1]
        }
      }
    },
    open_time: {
      type: DataTypes.JSON,
      get() {
        const openTime =  this.getDataValue("open_time")
        if (!openTime) {
          return null
        }
        return JSON.parse(openTime)
      }
    }
  }, {
    sequelize,
    tableName: 'stores',
    modelName: 'stores',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return Stores;
};
