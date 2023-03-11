'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nfts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.campaigns, {
        as: "campaigns",
        foreignKey: "campaign_id",
        onDelete: "cascade",
      });
    }
  }
  nfts.init({
    campaign_id: DataTypes.NUMBER,
    status: DataTypes.STRING,
    store_address: DataTypes.STRING,
    nft_address: DataTypes.STRING,
    holder_address: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'nfts',
    modelName: 'nfts',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return nfts;
};
