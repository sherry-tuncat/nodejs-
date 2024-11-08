'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const list = ['前端开发','后端开发','移动端开发','数据库','服务器运维','公共']
    await queryInterface.bulkInsert('Categories', list.map((item,index) => {
      return {name: item,rank: index+1, createdAt: new Date(),updatedAt: new Date()} 
      }
    ));
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
