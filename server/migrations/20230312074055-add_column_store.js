'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("stores", "location", {
      type: Sequelize.GEOMETRY('POINT'),
      comment: "중심 좌표"
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("reviews", "location");
  }
};
