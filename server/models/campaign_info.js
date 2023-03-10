'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class campaign_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  campaign_info.init({
    campaign_id: DataTypes.NUMBER,
    nft_type: DataTypes.STRING,
    discount_type: DataTypes.STRING,
    image_url: DataTypes.STRING,
    display_started_at: DataTypes.DATE,
    display_ended_at: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'campaign_infos',
    modelName: 'campaign_info',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return campaign_info;
};
