const express = require('express');
const router = express.Router();
const {Chapter,Course,User} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse')
const { NotFoundError } = require('../utils/errors')

/**
 * 获取章节详情
 * GET /
 * */
router.get('/:id', async function(req, res) {
  try {
    const { id } = req.params;
    if(!id){
      throw new Error('id不能为空')
    }
    // const condition = {
    //   attributes:{exclude:['CourseId']},
    //   include:[
    //     {
    //       attributes:{exclude:['UserId','CategoryId']},
    //       model:Course,
    //       as:'course',
    //       include:{
    //         model: User,
    //         as:'user',
    //       },
    //     }
    //   ]
    // };
    const chapter = await Chapter.findByPk(id,{
      attributes:{exclude:['CourseId']}
    });
    if(!chapter){
      throw new NotFoundError('章节不存在')
    }
    const course = await chapter.getCourse({
      attributes:{exclude:['UserId','CategoryId']}
    })
    const user = await course.getUser();
    const chapters = await Chapter.findAll({
      where:{
        courseId:chapter.courseId
      }
    })
    const data = {
      chapter,
      course,
      user,
      chapters
    }
    success(res,'查询成功',data);
  } catch (error) {
    failure(error,res)
  }
});

/**
 * 创建章节
 * POST /
 * */
router.post('/',async function(req,res){
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 课程数加一
    const course = await Course.findByPk(body.courseId);
    if(!course) {
      throw new NotFoundError('对应课程不存在')
    }
    // 插入数据
    const chapter = await Chapter.create(body)
    await course.increment('chaptersCount') 
    // 201状态码表示成功并且创建了新资源
    success(res,'创建章节成功',chapter,201);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 删除章节
 * DELETE /:id
 * */
router.delete('/:id',async function(req,res){
  try {
    // 获取章节
    const chapter = await getChapter(req)
    // 课程数减一
    const course = await Course.findOne({
      where:{
        id:chapter.courseId
      }
    });
    if(!course) {
      throw new NotFoundError('对应课程不存在')
    }
    await chapter.destroy();
    await course.decrement('chaptersCount') 
    success(res,'删除章节成功',chapter);
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 更新章节
 * PUT /:id
 * */
router.put('/:id',async function(req,res){
  try {
    // 获取章节
    const chapter = await getChapter(req)
    const course = await Course.findOne({
      where:{
        id:chapter.courseId
      }
    });
    if(!course) {
      throw new NotFoundError('对应课程不存在')
    }
    // 更新章节
    const body = filterBody(req);
    await chapter.update(body);
    success(res,'更新章节成功',chapter);
  } catch(error) {
    failure(error,res)
  }
})

/*
 * 公共方法：过滤白名单 
*/
function filterBody(req) {
  return {
    courseId:req.body.courseId,
    title:req.body.title,
    content:req.body.content,
    video:req.body.video,
    rank:req.body.rank,
    createdAt:new Date(),
    updatedAt:new Date()
  }
}

/*
 * 公共方法：获取章节 
*/
function getChapter(req) {
  const {id} = req.params;
  if(!id){
    throw new Error('id不能为空')
  }
  const chapter = Chapter.findByPk(id);
  if(!chapter){
    throw new NotFoundError('章节不存在')
  }
  return chapter;
}

module.exports = router;