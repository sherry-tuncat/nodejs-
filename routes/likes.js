const express = require('express');
const router = express.Router();
const {Course,Like,User} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse')
const { NotFoundError } = require('../utils/errors')

/**
 * 点赞、取消赞
 * POST /likes
 * */
router.post('/', async function(req, res) {
  try {
    const {userId} = req
    const {courseId} = req.body;
    if(!courseId){
      throw new Error('courseId不能为空')
    };
    // 确认课程存在
    // 检查课程之前是否已点赞
    const [course,like] = Promise.all([
      Course.findOne({
        where:{
          id:courseId
        }
      }),
      Like.findOne({
        where:{
          userId,
          courseId
        }
      })
    ])
    if(!course) {
      throw new Error('课程不存在')
    }
    // 存在则取消赞
    if(like) {
      await like.destroy();
      await course.decrement('likesCount')// 点赞数-1 参数自减1
      success(res,'取消点赞成功');
    }
    // 不存在新增记录
    if(!like) {
      await Like.create({userId,courseId});
      await course.increment('likesCount')// 点赞数+1 参数自增1
      success(res,'点赞成功');
    }
  } catch (error) {
    failure(error,res)
  }
});

/*
* 查询用户点赞的课程
* GET /likes/courses
* */
router.get('/courses', async function(req, res) {
  try {
    const {userId} = req;
    // 分页查询
    const currentPage = Number(req.query.currentPage) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (currentPage-1) * pageSize;
    // 查询当前用户
    const user = await User.findByPk(userId);
    // 获取当前用户多对多关联的课程
    // 计算总数
    const [courses,count] = Promise.all([
      user.getLikeCourses({
        joinTableAttributes:[], // 将关联表字段去掉
        attributes:{
          exclude:['CategoryId','UserId','content']
        },
        order:[['id','DESC']],
        offset,
        limit:pageSize
      }),
      user.countLikeCourses()
    ])
    success(res,'查询成功',{courses,count});
  } catch (error) {
    failure(error,res)
  }
})

module.exports = router;