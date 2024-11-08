'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email:'demo@qq.com',
        username:'sherry',
        password:bcrypt.hashSync('admin123', salt),
        nickname:'tuncat',
        sex:0,
        role:1,
        createdAt:new Date(),
        updatedAt:new Date()
      },
      {
        email:'user1@qq.com',
        username:'user1',
        password:bcrypt.hashSync('123123', salt),
        nickname:'user1',
        sex:1,
        role:0,
        createdAt:new Date(),
        updatedAt:new Date()
      },
      {
        email:'user2@qq.com',
        username:'user2',
        password:bcrypt.hashSync('123123', salt),
        nickname:'user2',
        sex:1,
        role:0,
        createdAt:new Date(),
        updatedAt:new Date()
      },
      {
        email:'user3@qq.com',
        username:'user3',
        password:bcrypt.hashSync('123123', salt),
        nickname:'user3',
        sex:1,
        role:0,
        createdAt:new Date(),
        updatedAt:new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
