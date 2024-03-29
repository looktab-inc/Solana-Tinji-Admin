'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.payments, {
        as: "payment",
        foreignKey: "payment_id",
        onDelete: "cascade",
      });
    }
  }
  reviews.init({
    store_address: DataTypes.STRING,
    reviewer_address: DataTypes.STRING,
    comment: DataTypes.STRING,
    payment_id: DataTypes.NUMBER
  }, {
    sequelize,
    tableName: 'reviews',
    modelName: 'review',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return reviews;
};
