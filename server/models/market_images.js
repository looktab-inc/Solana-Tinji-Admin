'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MarketImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MarketImages.init({
    market_id: DataTypes.INTEGER,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'market_images',
    modelName: 'marketImages',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return MarketImages;
};
