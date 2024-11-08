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
    await queryInterface.bulkInsert('Chapters', [
      {
        courseId:1,
        title:'css 课程介绍',
        content:'css的全名是层叠样式表，官方的解释，我就不细说了，因为就算能细说，对于新手朋友们来说，听的还是一脸懵逼，那我们就用最通俗的说法来讲，到底啥是css？',
        video:'',
        rank:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId:2,
        title:'nodejs 课程介绍',
        content:'这套课程，定位是使用js来全栈开发项目，让我们一起从零基础开始，学习接口开发。先从最基础的项目搭建、数据库的入门，再到完整的真实项目开发，一步步和大家一起完成一个真实的项目',
        video:'',
        rank:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId:2,
        title:'nodejs 安装',
        content:'安装nodejs，最简单方法，就是直接在官网下载了安装，但这种方法，却不是最好的办法。因为如果需要更新node.js的版本，那就需要把之前的卸载了，再去下载安装其他版本，这样就非常的麻烦了',
        video:'',
        rank:2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Chapters', null, {});
  }
};
