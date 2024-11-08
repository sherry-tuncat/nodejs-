'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chapter.belongsTo(models.Course, {
        as:'course'
      })
    }
  }
  Chapter.init({
    courseId: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull:{msg:'courseId必须填写'},
        notEmpty:{msg:'courseId不能为空'},
        async isPresent(value) {
          const course = await sequelize.models.Course.findByPk(value)
          if(!course) {
            throw new Error(`课程id${value}不存在`)
          }
        }
      }
    },
    title: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{msg:'标题必须填写'},
        notEmpty:{msg:'标题不能为空'},
        len:{
          args:[2,45],
          msg:'标题长度在2-45个字符之间'
        }
      }
    },
    content: DataTypes.TEXT,
    video: {
      type:DataTypes.STRING,
      validate:{
        isUrl:{
          msg:'视频链接格式不正确'
        }
      }
    },
    rank: {
      allowNull: false,
      type:DataTypes.INTEGER,
      validate:{
        isInt:{
          msg:'排序必须是整数'
        },
        isPositive(value) {
          if(value<1) {
            throw new Error('排序必须是正整数')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};