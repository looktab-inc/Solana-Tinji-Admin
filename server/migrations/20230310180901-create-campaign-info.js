'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaign_infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campaign_id: {
        type: Sequelize.INTEGER
      },
      nft_type: {
        type: Sequelize.ENUM('standard', 'dynamic'),
      },
      discount_type: {
        type: Sequelize.ENUM('amount', 'rate'),
      },
      image_url: {
        type: Sequelize.STRING,
      },
      display_started_at: {
        type: Sequelize.DATE
      },
      display_ended_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campaign_infos');
  }
};
