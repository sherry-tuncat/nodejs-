'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        allowNull: false,
        defaultValue: 0, // 0:female,1:male,9:other
        type: Sequelize.TINYINT.UNSIGNED
      },
      company: {
        type: Sequelize.STRING
      },
      introduce: {
        type: Sequelize.TEXT
      },
      role: {
        allowNull: false,
        defaultValue: 0, // 0:user,1:admin
        type: Sequelize.TINYINT.UNSIGNED
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
    // 要索引的表
    await queryInterface.addIndex('Users', {
      fields: ['email'], // 要索引的字段
      unique: true // 唯一索引
    });
    await queryInterface.addIndex('Users', {
      fields: ['username'], // 要索引的字段
      unique: true // 唯一索引
    });
    await queryInterface.addIndex('Users', {
      fields: ['role'], // 要索引的字段
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};