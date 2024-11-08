const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')

const sequelize = new Sequelize(config[env].database,config[env].username, config[env].password, {
  host: config[env].database.host,
  dialect: 'mysql',
})
module.exports = sequelize;