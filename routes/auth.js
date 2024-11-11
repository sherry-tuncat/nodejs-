const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const {User} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/**
 * 注册
 * POST /sign_up
 * */
router.post('/sign_up', async function(req, res) {
  try {
    const body = {
      email:req.body.email,
      username:req.body.username,
      nickname:req.body.nickname,
      password:req.body.password,
      sex:9, // 默认unknown
      role:0 // 默认普通用户注册
    }
    if(!body.email || !body.username || !body.nickname) {
      throw new BadRequestError('请输入完整信息')
    }
    if(!body.password) {
      throw new BadRequestError('请输入密码')
    }
    // 列表
    const user = await User.create(body);
    // 删除密码参数
    delete user.dataValues.password;
    delete user.dataValues.sex;
    delete user.dataValues.role;
    success(res,'查询成功',user);
  } catch (error) {
    failure(error,res)
  }
});

/**
 * 登入
 * POST /sign_in
 * */
router.post('/sign_in',async function(req,res){
  try {
    const {login,password} = req.body;
    if(!login) {
      throw new BadRequestError('请输入用户名/邮箱')
    }
    if(!password) {
      throw new BadRequestError('请输入密码')
    }
    const condition = {
      where:{
        [Op.or]:[
          {email:login},
          {username:login}
        ]
      }
    };
    // 查询用户&验证密码
    const [user,isValid] = Promise.all([
      User.findOne(condition),
      bcrypt.compare(password,user.password)
    ])
    if(!user) {
      throw new Error('用户不存在')
    }
    if(!isValid) {
      throw new UnauthorizedError('密码不正确')
    }
    // 使用jwt的包，生成token身份验证令牌
    const token = jwt.sign({
      id:user.id,
      username:user.username
    },process.env.SECRET,{expiresIn:'30d'})
    success(res,'登录成功',{
      token
    })
  } catch(error){
    failure(error,res)
  }
  
})

module.exports = router;