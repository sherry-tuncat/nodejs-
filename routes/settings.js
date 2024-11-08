const express = require('express');
const router = express.Router();
const {Setting} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse')
const { NotFoundError } = require('../utils/errors')

/**
 * 获取设置信息
 * GET /settings
 * */
router.get('/', async function(req, res) {
  try {
    // 列表
    const setting = await Setting.findOne();
    success(res,'查询成功',setting);
  } catch (error) {
    failure(error,res)
  }
});

module.exports = router;