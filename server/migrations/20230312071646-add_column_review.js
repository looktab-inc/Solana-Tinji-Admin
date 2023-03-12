'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("reviews", "payment_amount", {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("reviews", "payment_amount");
  }
};
