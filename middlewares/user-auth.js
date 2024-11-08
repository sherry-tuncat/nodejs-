const jwt = require('jsonwebtoken');
const {User} = require('../models');
const {
  failure
} = require('../utils/reponse')
const { 
  UnauthorizedError,
} = require('../utils/errors')

module.exports = async (req,res,next)=>{
  try {
    const {token} = req.headers;
    if(!token) {
      throw new UnauthorizedError('当前接口需要token认证才能访问')
    }
    // 校验token是否正确,decoded返回保存的内容
    const decoded = jwt.verify(token,process.env.SECRET);
    // 获取用户id
    const {id} = decoded;
    // 查询当前用户
    const user = await User.findByPk(id)
    if(!user) {
      throw new UnauthorizedError('用户不存在')
    }
    // 将数据放到req中，大家都可以随意调用
    req.userId = user.id;
    // 一定要加next，不然不会往下执行
    next();
  } catch(error) {
    failure(error,res)
  }
}