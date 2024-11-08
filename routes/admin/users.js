const express = require('express');
const router = express.Router();
const {User} = require('../../models');
const {Op} = require('sequelize');
const {
  success,
  failure
} = require('../../utils/reponse')
const { NotFoundError,UnauthorizedError } = require('../../utils/errors')

/**
 * 查询用户列表
 * GET /admin/users
 * */
router.get('/', async function(req, res) {
  try {
    // 获取查询参数
    const query = req.query;
    // 分页查询
    const currentPage = Number(query.currentPage) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const offset = (currentPage-1) * pageSize;
    // 倒序排列，一般默认倒叙展示最新内容
    const condition = {
      order:[['id','DESC']],
      offset,
      limit:pageSize,
    }
    // 模糊搜索
    if(query.email) {
      condition.where = {
        email:{
          [Op.eq]:`${query.email}`
        }
      }
    }
    if(query.username) {
      condition.where = {
        username:{
          [Op.eq]:`${query.username}`
        }
      }
    }
    if(query.nickname) {
      condition.where = {
        username:{
          [Op.like]:`%${query.nickname}%`
        }
      }
    }
    if(query.sex) {
      condition.where = {
        sex:{
          [Op.eq]:`${query.sex}`
        }
      }
    }
    if(query.company) {
      condition.where = {
        company:{
          [Op.like]:`%${query.company}%`
        }
      }
    }
    if(query.introduce) {
      condition.where = {
        introduce:{
          [Op.like]:`%${query.introduce}%`
        }
      }
    }
    if(query.role) {
      condition.where = {
        role:{
          [Op.eq]:`%${query.role}%`
        }
      }
    }
    const {count,rows} = await User.findAndCountAll(condition);
    const data = {
      users:rows,
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
 * 查询用户详情
 * GET /admin/users/:id
 * */
router.get('/:id',async function(req,res) {
  try {
    // 根据id查询用户
    const article = await getUser(req);
    success(res,'查询成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 创建用户
 * POST /api/users
 */
router.post('/',async function(req,res){
  try {
    if(!isAdmin()) {
      throw new UnauthorizedError('只有管理员可操作')
    }
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据
    const article = await User.create(body)
    // 201状态码表示成功并且创建了新资源
    success(res,'创建用户成功',article,201);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 更新用户
 * PUT /api/users/:id
 */
router.put('/:id',async function(req,res){
  try {
    if(!isAdmin()) {
      throw new UnauthorizedError('只有管理员可操作')
    }
    // 白名单过滤
    const body = filterBody(req);
    // 获取用户
    const article = await getUser(req)
    await article.update(body);
    success(res,'更新用户成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
  return {
    email:req.body.email,
    username:req.body.username,
    password:req.body.password,
    nickname:req.body.nickname,
    sex:req.body.sex,
    company:req.body.company,
    introduce:req.body.introduce,
    role:req.body.role,
    avatar:req.body.avatar,
  }
}

/**
 * 公共方法：获取用户
 */
async function getUser(req) {
  const {id} = req.params;
  if(!id) {
    throw new NotFoundError(`id不能为空`)
  }
  const user = await User.findByPk(id);
  if(!user) {
    throw new NotFoundError(`ID:${id}的用户未找到`)
  }
  return user
}

/**
 * 公共方法：判断当前用户是否管理员
 */
function isAdmin(req) {
  return req.user.role === 1
}

module.exports = router;
