const express = require('express');
const router = express.Router();
const {Chapter,Course} = require('../../models');
const {Op} = require('sequelize');
const {
  success,
  failure
} = require('../../utils/reponse')
const { NotFoundError } = require('../../utils/errors')

/**
 * 查询课程章节列表
 * GET /admin/chapters
 * */
router.get('/', async function(req, res) {
  try {
    // 获取查询参数
    const query = req.query;
    // 分页查询
    const currentPage = Number(query.currentPage) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const offset = (currentPage-1) * pageSize;

    if(!query.courseId) {
      throw new Error('courseId不能为空')
    }
    // 倒序排列，一般默认倒叙展示最新内容
    const condition = {
      order:[['rank','ASC'],['id','ASC']],
      offset,
      limit:pageSize,
      where:{},
      ...getCourse()
    }
    // 模糊搜索
    if(query.courseId) {
      condition.where.courseId = {
        [Op.eq]:`${query.courseId}`
      }
    }
    if(query.title) {
      condition.where.title = {
        [Op.like]:`%${query.title}%`
      }
    }
    if(query.content) {
      condition.where.content = {
        [Op.like]:`%${query.content}%`
      }
    }
    if(query.video) {
      condition.where.video = {
        [Op.like]:`%${query.video}%`
      }
    }
    if(query.rank) {
      condition.where.rank = {
        [Op.eq]:`${query.rank}`
      }
    }
    const {count,rows} = await Chapter.findAndCountAll(condition);
    const data = {
      chapters:rows,
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
 * 查询课程章节详情
 * GET /admin/chapters/:id
 * */
router.get('/:id',async function(req,res) {
  try {
    // 根据id查询课程章节
    const article = await getChapter(req);
    success(res,'查询成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 创建课程章节
 * POST /api/chapters
 */
router.post('/',async function(req,res){
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据
    const article = await Chapter.create(body)
    // 201状态码表示成功并且创建了新资源
    success(res,'创建课程章节成功',article,201);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 删除课程章节
 * DELETE /api/chapters/:id
 */
router.delete('/:id',async function(req,res){
  try {
    // 获取课程章节
    const article = await getChapter(req)
    await article.destroy()
    success(res,'删除课程章节成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 更新课程章节
 * PUT /api/chapters/:id
 */
router.put('/:id',async function(req,res){
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 获取课程章节
    const article = await getChapter(req)
    await article.update(body);
    success(res,'更新课程章节成功',article);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 公共方法：查询关联课程
 */
function getCourse() {
  return {
    include:[
      {
        model:Course,
        as:'course',
        attributes:['id','name']
      },
    ]
  }
}

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
  return {
    courseId:req.body.courseId,
    title:req.body.title,
    content:req.body.content,
    video:req.body.video,
    rank:req.body.rank
  }
}

/**
 * 公共方法：获取课程章节
 */
async function getChapter(req) {
  const {id} = req.params;
  if(!id) {
    throw new NotFoundError(`id不能为空`)
  }
  const condition = {
    ...getCourse()
  }
  const article = await Chapter.findByPk(id,condition);
  if(!article) {
    throw new NotFoundError(`ID:${id}的课程章节未找到`)
  }
  return article
}

module.exports = router;
