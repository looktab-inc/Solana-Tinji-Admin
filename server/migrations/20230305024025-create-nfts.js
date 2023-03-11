'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nfts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campaign_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      store_address: {
        type: Sequelize.STRING
      },
      holder_address : {
        type: Sequelize.STRING
      },
      nft_address: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('nfts');
  }
};
