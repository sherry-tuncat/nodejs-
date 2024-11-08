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

module.exports = router;