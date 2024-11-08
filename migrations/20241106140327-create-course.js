'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      recommended: {
        defalutValue: false,
        type: Sequelize.BOOLEAN
      },
      introductory: {
        defalutValue: false,
        type: Sequelize.BOOLEAN
      },
      content: {
        type: Sequelize.TEXT
      },
      likesCount: {
        defalutValue: 0,
        type: Sequelize.INTEGER.UNSIGNED
      },
      chaptersCount: {
        defalutValue: 0,
        type: Sequelize.INTEGER.UNSIGNED
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('Courses', {
      fields: ['categoryId'], // 要索引的字段
    });
    await queryInterface.addIndex('Courses', {
      fields: ['userId'], // 要索引的字段
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};