const express = require('express');
const router = express.Router();
const {Setting} = require('../../models');
const {
  success,
  failure
} = require('../../utils/reponse')
const { NotFoundError } = require('../../utils/errors')

/**
 * 查询系统设置
 * GET /admin/setting
 * */
router.get('/', async function(req, res) {
  try {
    const setting = await Setting.findOne();
    const data = {
      setting
    }
    success(res,'查询成功',data);
  } catch (error) {
    failure(error,res)
  }
});


/**
 * 更新系统设置
 * PUT /api/settings/:id
 */
router.put('/',async function(req,res){
  try {
    // 获取系统设置
    const category = await getSetting()
    const body = filterBody(req);
    // 处理白名单
    await category.update({...body,updatedAt:new Date()});
    success(res,'更新系统设置成功',category);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
  return {
    name:req.body.name,
    icp:req.body.icp,
    copyright:req.body.copyright
  }
}

/**
 * 公共方法：获取系统设置
 */
async function getSetting() {
  const setting = await Setting.findOne();
  if(!setting) {
    throw new NotFoundError(`系统设置未初始化，请执行种子文件`)
  }
  return setting
}

module.exports = router;
