const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcrypt = require('bcryptjs');
const {
  success,
  failure
} = require('../utils/reponse')
const { BadRequestError,UnauthorizedError } = require('../utils/errors')

/**
 * 获取用户详情
 * GET /users/me
 * */
router.get('/me', async function(req, res) {
  try {
    const user = await getUser(req);
    delete user.dataValues.password;
    delete user.dataValues.role;
    success(res,'查询成功',user);
  } catch (error) {
    failure(error,res)
  }
});

/**
 * 更新用户信息
 * PUT /users/info
 * */
router.put('/info', async function(req, res) {
  try {
    const user = await getUser(req);
    // 过滤白名单字段
    const body = {
      email: req.body.email,
      username: req.body.username,
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar,
      updatedAt: new Date()
    }
    await user.update(body)
    delete user.dataValues.password;
    delete user.dataValues.role;
    success(res, '更新用户信息成功', user)
  } catch(error) {
    failure(error, res)
  }
})

/**
 * 更新用户密码
 * /users/account
 */
router.put('/account',async function(req,res){
  try {
    const user = await getUser(req);
    const {
      email,
      username,
      current_password, // 当前密码
      password, // 新密码
      passwordConfirmation, // 确认新密码
    } = req.body;
    if (!current_password || !password || !passwordConfirmation) {
      throw new BadRequestError('请输入密码')
    }
    if(current_password===password) {
      throw new BadRequestError('新旧密码不能一致')
    }
    if (password !== passwordConfirmation) {
      throw new BadRequestError('确认密码和密码不一致')
    }
    const isValid = await bcrypt.compare(current_password,user.password);
    if(!isValid) {
      throw new UnauthorizedError('旧密码不正确')
    }
    const body = {
      email,
      username,
      password,
      updatedAt:new Date()
    }
    await user.update(body)
    delete user.dataValues.password; 
    delete user.dataValues.role; 
    success(res,'密码修改成功',user)
  } catch(error) {
    failure(error,res)
  }
})

/*
* 公共方法：获取当前用户
* */
async function getUser(req) {
  const userId = req.userId
  if(!userId) {
    throw new Error('userId不存在')
  }
  const user = await User.findByPk(userId);
  if(!user) {
    throw new Error(`id为${userId}用户不存在`)
  }
  return user;
}

module.exports = router;
