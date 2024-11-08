'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        type: Sequelize.STRING,
        validate:{
          notEmpty: {msg:'名称不能为空'},
          notNull: {msg:'名称必传'},
          len: {
            args: [2, 45],
            msg: '名称长度在2-45个字符之间'
          }
        }
      },
      icp: {
        type: Sequelize.STRING,
        validate:{
          notEmpty: {msg:'名称不能为空'},
          notNull: {msg:'名称必传'},
        }
      },
      copyright: {
        type: Sequelize.STRING,
        validate:{
          notEmpty: {msg:'名称不能为空'},
          notNull: {msg:'名称必传'},
        }
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Settings');
  }
};