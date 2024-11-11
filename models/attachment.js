'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Attachment.belongsTo(models.User, {
        as:'user'
      })
    }
  }
  Attachment.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    originalname: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    filename: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    mimetype: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    size: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    path: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    fullpath: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    url: {
      type:DataTypes.STRING,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};