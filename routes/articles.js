const express = require('express');
const router = express.Router();
const {Article} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse')
const { NotFoundError } = require('../utils/errors')

/**
 * 获取文章列表
 * GET /articles/
 * */
router.get('/', async function(req, res) {
  try {
    // 分页查询
    const currentPage = req.query.currentPage || 1;
    const pageSize = req.query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      order:[['createdAt','DESC'],['id','DESC']],
      offset,
      limit:pageSize
    }
    // 列表
    const {rows,count} = await Article.findAndCountAll(condition);
    const data = {
      articles:rows,
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
 * 获取文章详情
 * GET /articles/:id
 * */
router.get('/:id', async function(req, res) {
  try {
    const {id} = req.params;
    if(!id) {
      throw new Error('id不能为空')
    }
    // 获取详情
    const article = await Article.findByPk(id);
    if(!article) {
      throw new Error('文章不存在')
    }
    success(res,'查询成功',article);
  } catch (error) {
    failure(error,res)
  }
});

module.exports = router;