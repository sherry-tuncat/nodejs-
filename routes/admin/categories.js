const express = require('express');
const router = express.Router();
const {Category,Course} = require('../../models');
const {Op} = require('sequelize');
const {
  success,
  failure
} = require('../../utils/reponse')
const { NotFoundError } = require('../../utils/errors')

/**
 * 查询分类列表
 * GET /admin/categories
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
      order:[['rank','ASC'],['id','ASC']],
      offset,
      limit:pageSize,
    }
    // 模糊搜索
    if(query.name) {
      condition.where = {
        name:{
          [Op.like]:`%${query.name}%`
        }
      }
    }
    const {count,rows} = await Category.findAndCountAll(condition);
    const data = {
      categories:rows,
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
 * 查询分类详情
 * GET /admin/categories/:id
 * */
router.get('/:id',async function(req,res) {
  try {
    // 根据id查询分类
    const category = await getCategory(req);
    success(res,'查询成功',category);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 创建分类
 * POST /api/categories
 */
router.post('/',async function(req,res){
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据
    const category = await Category.create(body)
    // 201状态码表示成功并且创建了新资源
    success(res,'创建分类成功',category,201);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 删除分类
 * DELETE /api/categories/:id
 */
router.delete('/:id',async function(req,res){
  try {
    // 获取分类
    const category = await getCategory(req)
    // 判断是否有子类
    const count = await Course.count({
      where:{
        categoryId:category.id
      }
    })
    if(count>0){
      throw new Error('该分类下有课程，不能删除')
    }
    await category.destroy()
    success(res,'删除分类成功',category);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 更新分类
 * PUT /api/categories/:id
 */
router.put('/:id',async function(req,res){
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 获取分类
    const category = await getCategory(req)
    await category.update(body);
    success(res,'更新分类成功',category);
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
    rank:req.body.rank
  }
}

/**
 * 公共方法：获取分类
 */
async function getCategory(req) {
  const {id} = req.params;
  if(!id) {
    throw new NotFoundError(`id不能为空`)
  }
  const category = await Category.findByPk(id);
  if(!category) {
    throw new NotFoundError(`ID:${id}的分类未找到`)
  }
  return category
}

module.exports = router;
