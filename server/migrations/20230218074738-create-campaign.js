'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      store_address: {
        type: Sequelize.STRING(100),
        comment: "월렛 주소"
      },
      title: {
        type: Sequelize.STRING(150),
        comment: "캠페인 이름"
      },
      description: {
        type: Sequelize.TEXT,
      },
      location: {
        type: Sequelize.GEOMETRY('POINT')
      },
      distance: {
        type: Sequelize.DOUBLE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campaigns');
  }
};
