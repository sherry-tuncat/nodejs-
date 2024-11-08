const express = require('express');
const router = express.Router();
const {Category} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse')
const { NotFoundError } = require('../utils/errors')

/**
 * 获取分类列表
 * GET /
 * */
router.get('/', async function(req, res) {
  try {
    // 列表
    const categories = await Category.findAll({
      order:[['rank','ASC'],['id','DESC']],
    });
    success(res,'查询成功',categories);
  } catch (error) {
    failure(error,res)
  }
});

module.exports = router;