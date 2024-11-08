const express = require('express');
const router = express.Router();
const {Course,User,Category} = require('../models');
const {Op} = require('sequelize');
const {
  success,
  failure
} = require('../utils/reponse')
const { NotFoundError } = require('../utils/errors')

/**
 * 获取首页数据
 * GET /index
 * */
router.get('/', async function(req, res) {
  try {
    // 推荐课程
    const recommendedCourses = await Course.findAll({
      order:[['id','ASC']],
      attributes:{exclude:['UserId','CategoryId','content']},
      include:[
        {
          model: User,
          as:'user',
          attributes:['username','avatar','company']
        },
        {
          model: Category,
          as:'category',
          attributes:['name']
        },
      ],
      limit:10,
      where:{
        recommended:{
          [Op.eq]:1
        }
      }
    });
    // 人气课程
    const likesCourses = await Course.findAll({
      order:[['likesCount','DESC'],['id','DESC']],
      attributes:{exclude:['UserId','CategoryId','content']},
      include:[
        {
          model: User,
          as:'user',
          attributes:['username','avatar','company']
        },
        {
          model: Category,
          as:'category',
          attributes:['name']
        },
      ],
      limit:10,
    })
    // 入门课程
    const introductoryCourses = await Course.findAll({
      order:[['id','ASC']],
      attributes:{exclude:['UserId','CategoryId','content']},
      include:[
        {
          model: User,
          as:'user',
          attributes:['username','avatar','company']
        },
        {
          model: Category,
          as:'category',
          attributes:['name']
        },
      ],
      limit:10,
      where:{
        introductory:{
          [Op.eq]:1
        }
      }
    });
    const data = {
      recommendedCourses,
      likesCourses,
      introductoryCourses
    }
    if(req.query.callback) {
      res.set('Content-Type','application/javascript');
      res.send(`${req.query.callback}(${JSON.stringify(data)})`)
    } else {
      success(res,'查询成功',data);
    }
  } catch (error) {
    failure(error,res)
  }
});

module.exports = router;