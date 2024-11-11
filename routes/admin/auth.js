const express = require('express');
const router = express.Router();
const {User} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {
  success,
  failure
} = require('../../utils/reponse')
const { 
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} = require('../../utils/errors')

router.post('/sign_in',async function(req,res) {
  try {
    // 基础验证
    const {login,password} = req.body;
    // 验证login
    if(!login){
      throw new BadRequestError('请输入用户名/邮箱')
    }
    if(!password){
      throw new BadRequestError('请输入密码')
    }
    const condition = {
      where:{
        [Op.or]:[
          {email:login},
          {username:login}
        ]
      }
    }
    // 获取用户和验证密码
    const [user,isValid] = Promise.all([
      User.findOne(condition),
      bcrypt.compare(password,user.password)
    ])
    if(!user) {
      throw new NotFoundError('用户不存在')
    }
    
    if(!isValid) {
      throw new UnauthorizedError('密码不正确')
    }
    // 判断是否管理员
    const isAdmin = user.role === 1;
    if(!isAdmin) {
      throw new UnauthorizedError('非管理员无法访问')
    }
    // 使用jwt的包，生成token身份验证令牌
    const token = jwt.sign({
      id:user.id,
      username:user.username,
      role:user.role
    },process.env.SECRET,{expiresIn:'30d'})
    success(res,'管理员登录成功',{
      token
    })
  } catch(error) {
    failure(error,res)
  }
  
})

module.exports = router;