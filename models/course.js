'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Course.belongsTo(models.Category,{as:'category'}); // 将categoryId与course关联起来,as指定别名
      models.Course.belongsTo(models.User,{as:'user'}); // 将userId与course关联起来,as指定别名
      models.Course.hasMany(models.Chapter,{as:'chapters'}); // 将course与chapter关联起来,as指定别名
      models.Course.belongsToMany(models.User,{through:models.Like,foreignKey:'courseId',as:'likeUsers'}); // course通过like与user建立联系，as指定别名
    }
  }
  Course.init({
    categoryId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:'分类id必须存在'
        },
        notEmpty:{
          msg:'分类id不能为空'
        },
        async isPresent(value) {
          const category = await sequelize.models.Category.findByPk(value)
          if(!category) {
            throw new Error(`分类id${value}不存在`)
          }
        }
      }
    },
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:'用户id必须存在'
        },
        notEmpty:{
          msg:'用户id不能为空'
        },
        async isPresent(value) {
          const category = await sequelize.models.User.findByPk(value)
          if(!category) {
            throw new Error(`用户id${value}不存在`)
          }
        }
      }
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    recommended: DataTypes.BOOLEAN,
    introductory: DataTypes.BOOLEAN,
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};