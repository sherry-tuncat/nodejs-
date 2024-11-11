const express = require('express');
const router = express.Router();
const {User} = require('../../models');
const sequelize = require('../../utils/database')
const {
  success,
  failure
} = require('../../utils/reponse')
const { NotFoundError } = require('../../utils/errors')

/**
 * 统计用户性别数量
 * GET /admin/charts/sex
 * */
router.get('/sex',async function(req,res) {
  try {
    const [female,male,unknown] = Promise.all([
      User.count({where:{sex:0}}),
      User.count({where:{sex:1}}),
      User.count({where:{sex:9}})
    ])
    const data = [
      {
        value:female,
        name:'男性'
      },
      {
        value:male,
        name:'女性'
      },
      {
        value:unknown,
        name:'未知'
      },
    ]
    success(res,'查询成功',data);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 统计每个月用户注册的数量
 * GET /admin/charts/user
 * */
router.get('/user',async function(req,res){
  try {
    const [result] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`,'%Y-%m') AS `month`,COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC")
    const data = {
      months:[],
      values:[]
    }
    result.forEach(item=>{
      data.months.push(item.month)
      data.values.push(item.value)
    })
    success(res,'查询成功',data);
  } catch(error) {
    failure(error,res)
  }
})

module.exports = router;