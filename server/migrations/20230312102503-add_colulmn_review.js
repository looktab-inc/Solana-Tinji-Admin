'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("reviews", "payment_id", {
      type: Sequelize.INTEGER,
      comment: '결제 정보 ID'
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("reviews", "payment_id");
  }
};
