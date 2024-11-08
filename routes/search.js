const express = require('express');
const router = express.Router();
const {Course} = require('../models');
const {Op} = require('sequelize');
const {
  success,
  failure
} = require('../utils/reponse')
const { NotFoundError } = require('../utils/errors')

/**
 * 搜索课程
 * GET /
 * */
router.get('/', async function(req, res) {
  try {
    const {name} = req.query;
    // 分页查询
    const currentPage = Number(req.query.currentPage) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (currentPage-1) * pageSize;
    const condition = {
      offset,
      limit:pageSize,
      where:{
        name:{
          [Op.like]:`%${name}%`
        }
      }
    }
    const {rows,count} = await Course.findAndCountAll(condition)
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

module.exports = router;