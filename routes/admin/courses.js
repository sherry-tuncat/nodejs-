const express = require('express');
const router = express.Router();
const {Course, Category, User, Chapter} = require('../../models');
const {Op} = require('sequelize');
const {
  success,
  failure
} = require('../../utils/reponse')
const { NotFoundError } = require('../../utils/errors')

/**
 * 查询课程列表
 * GET /admin/courses
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
      ...getInfo(),
      order:[['id','DESC']],
      offset,
      limit:pageSize,
    }
    // 模糊搜索
    if(query.categoryId) {
      condition.where = {
        categoryId:{
          [Op.eq]:`${query.categoryId}`
        }
      }
    }
    if(query.userId) {
      condition.where = {
        userId:{
          [Op.eq]:`${query.userId}`
        }
      }
    }
    if(query.name) {
      condition.where = {
        name:{
          [Op.like]:`%${query.name}%`
        }
      }
    }
    if(query.image) {
      condition.where = {
        image:{
          [Op.like]:`%${query.image}%`
        }
      }
    }
    if(query.recommended) {
      condition.where = {
        recommended:{
          [Op.eq]:query.recommended === 'true'
        }
      }
    }
    if(query.introductory) {
      condition.where = {
        introductory:{
          [Op.eq]:query.introductory === 'true'
        }
      }
    }
    const {count,rows} = await Course.findAndCountAll(condition);
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

/**
 * 查询课程详情
 * GET /admin/courses/:id
 * */
router.get('/:id',async function(req,res) {
  try {
    // 根据id查询课程
    const article = await getCourse(req);
    success(res,'查询成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 创建课程
 * POST /api/courses
 */
router.post('/',async function(req,res){
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据
    const article = await Course.create(body)
    // 201状态码表示成功并且创建了新资源
    success(res,'创建课程成功',article,201);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 删除课程
 * DELETE /api/courses/:id
 */
router.delete('/:id',async function(req,res){
  try {
    // 获取课程
    const article = await getCourse(req)
    // 判断下面是否有章节，有章节不能删除
    const count = await Chapter.count({
      where:{
        courseId:article.id
      }
    })
    if(count>0) {
      throw new Error('课程下面有章节，不能删除')
    }
    await article.destroy()
    success(res,'删除课程成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 更新课程
 * PUT /api/courses/:id
 */
router.put('/:id',async function(req,res){
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 获取课程
    const article = await getCourse(req)
    await article.update(body);
    success(res,'更新课程成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
  return {
    categoryId:req.body.categoryId,
    userId:req.body.userId,
    name:req.body.name,
    image:req.body.image,
    recommended:req.body.recommended,
    introductory:req.body.introductory,
    content:req.body.content,
  }
}

/**
 * 公共方法：获取关联信息
 */
function getInfo() {
  return {
    include:[
    {
      model:Category,
      as:'category',
      attributes:['id','name']
    },
    {
      model:User,
      as:'user',
      attributes:['id','username','avatar']  
    }
  ]}
}

/**
 * 公共方法：获取课程
 */
async function getCourse(req) {
  const {id} = req.params;
  if(!id) {
    throw new NotFoundError(`id不能为空`)
  }
  const article = await Course.findByPk(id,getInfo());
  if(!article) {
    throw new NotFoundError(`ID:${id}的课程未找到`)
  }
  return article
}

module.exports = router;
