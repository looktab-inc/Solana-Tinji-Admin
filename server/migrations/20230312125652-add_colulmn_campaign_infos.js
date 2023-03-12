'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await  queryInterface.addColumn("campaign_infos", "completed_at", {
      type: Sequelize.DATE,
      comment: '업데이이트 완료 여부'
    })
    await  queryInterface.addColumn("campaign_infos", "discount_rate", {
      type: Sequelize.DOUBLE,
      comment: '할인율'
    })
    await queryInterface.addColumn("campaign_infos", "discount_amount", {
      type: Sequelize.DOUBLE,
      comment: '할인가격'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("campaign_infos", "discount_amount")
    await queryInterface.removeColumn("campaign_infos", "discount_rate")
    await queryInterface.removeColumn("campaign_infos", "completed_at")
  }
};
