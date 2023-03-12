'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.review, {
        as: "review",
        foreignKey: "payment_id",
        onDelete: "cascade",
      })
      this.belongsTo(models.stores, {
        as: "stores",
        foreignKey: "store_address",
        targetKey: 'address',
        onDelete: "cascade",
      });
    }
  }
  payments.init({
    store_address: DataTypes.STRING,
    holder_address: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
  }, {
    sequelize,
    tableName: 'payments',
    modelName: 'payments',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return payments;
};
