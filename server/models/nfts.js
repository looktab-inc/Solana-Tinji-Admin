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
      // define association here
    }
  }
  nfts.init({
    store_address: DataTypes.STRING,
    nft_address: DataTypes.STRING
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
