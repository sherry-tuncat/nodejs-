'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Course, {
        as:'courses'
      });
      models.User.belongsToMany(models.Course,{through:models.Like,foreignKey:'userId',as:'likeCourses'}); // user通过like与course建立联系，as指定别名
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{msg:'邮箱必传'},
        notEmpty:{msg:'邮箱不能为空'},
        async isUnique(value) {
          const user = await User.findOne({where:{email:value}})
          if(user){
            throw new Error('邮箱已存在')
          }
        }
      }
    },
    username: {
      allowNull: false,
      type:DataTypes.STRING,
      validate: {
        notNull:{msg:'用户名必传'},
        notEmpty:{msg:'用户名不能为空'},
        len: {args:[2,45],msg:'用户名长度在2-45之间'},
        async isUnique(value) {
          const user = await User.findOne({where:{email:value}})
          if(user){
            throw new Error('用户名已存在')
          }
        }
      }
    },
    password: {
      allowNull:false,
      type:DataTypes.STRING,
      validate: {
        notNull:{msg:'密码必传'},
        notEmpty:{msg:'密码不能为空'},
      },
      set(value) {
        if(value.length<8 || value.length>20) {
          throw new Error('密码长度在8-20之间')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(value, salt)
        this.setDataValue('password', hash)
      }
    },
    nickname: DataTypes.STRING,
    sex: {
      type:DataTypes.TINYINT,
      isIn:{args:[[0,1,9]],msg:'性别的值必须是，女性0、男性1、未选择9'},
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: DataTypes.TINYINT,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};