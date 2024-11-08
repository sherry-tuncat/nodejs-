const express = require('express');
const router = express.Router();
const {Course,Chapter,Category,User} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse')

/**
 * 查询课程列表
 * GET /courses?categoryId=xx
 * */
router.get('/', async function(req, res) {
  try {
    // 获取查询参数
    const {categoryId} = req.query;
    if(!categoryId) {
      throw new Error('categoryId不能为空')
    }
    // 分页查询
    const currentPage = Number(req.query.currentPage) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (currentPage-1) * pageSize;
    const condition = {
      order:[['id','ASC']],
      offset,
      limit:pageSize,
      where:{
        categoryId
      }
    }
    const {count,rows} = await Course.findAndCountAll(condition);
    const data = {
      courses:rows,
      pagination:{
        total:count,
        currentPage,
        pageSize
      }
    }
    success(res,'查询成功',data);
  } catch (error) {
    failure(error,res)
  }
});

/**
 * 查询课程详情
 * GET /courses/:id
 * */
router.get('/:id', async function(req, res) {
  try {
    // 获取查询参数
    const {id} = req.params;
    if(!id) {
      throw new Error('课程不能为空')
    }
    const condition1 = {
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
    }
    const course = await Course.findByPk(id,condition1);
    if(!course) {
      throw new Error('课程不存在')
    }
    // 分页查询
    const currentPage = Number(req.query.currentPage) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (currentPage-1) * pageSize;
    const condition = {
      order:[['rank','ASC']],
      offset,
      limit:pageSize,
      where:{
        courseId:id
      }
    }
    const {count,rows} = await Chapter.findAndCountAll(condition);
    const data = {
      course,
      chapter:{
        rows,
        pagination:{
          total:count,
          currentPage,
          pageSize
        }
      }
    }
    success(res,'查询成功',data);
  } catch (error) {
    failure(error,res)
  }
});

module.exports = router;