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
      // define association here
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
        const point = this.getDataValue("location")['coordinates']
        return {
          lng: point[0],
          lat : point[1]
        }
      }
    },
    open_time: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue("open_time"));
      },
      set(value) {
        return this.setDataValue("open_time", JSON.stringify(value));
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
