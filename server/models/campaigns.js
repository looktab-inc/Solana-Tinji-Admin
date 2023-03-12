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
      this.hasMany(models.campaign_infos, {
        as: "campaign_infos",
        foreignKey: "campaign_id",
        onDelete: "cascade",
      });
      this.hasMany(models.nfts, {
        as: "nfts",
        foreignKey: "campaign_id",
        onDelete: "cascade",
      });
      this.hasMany(models.nfts, {
        as: "hasNfts",
        foreignKey: "campaign_id",
        onDelete: "cascade",
      });
    }
  }
  Campaign.init({
    title: DataTypes.STRING,
    store_address: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.GEOMETRY('POINT'),
    boundary: DataTypes.GEOMETRY('POLYGON'),
    distance: DataTypes.DOUBLE,
    display_started_at: DataTypes.DATE,
    display_ended_at: DataTypes.DATE
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
