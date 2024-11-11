const express = require('express');
const router = express.Router();
const {Attachment,User} = require('../../models');
const {
  success,
  failure
} = require('../../utils/reponse')
const { BadRequestError,NotFoundError } = require('../../utils/errors')
const {config,client,singleFileUpload} = require('../../utils/aliyun');

/**
 * 查询上传附件列表
 * GET /upload/
 */
router.get('/',async function(req,res){
  try {
    const query = req.query;
    const currentPage = query.currentPage || 1;
    const pageSize = query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      order:[['createdAt','DESC'],['id','DESC']],
      offset,
      limit:pageSize,
      include:[
        {
          model:User,
          as:'user',
          attributes:['id','username','avatar']
        }
      ]
    }
    const {rows,count} = await Attachment.findAndCountAll(condition);
    const data = {
      attachments:rows,
      pagination:{
        total:count,
        currentPage,
        pageSize
      }
    }
    success(res,'查询成功',data)
  } catch(error) {
    failure(error,res)
  }
})

/**
 * 删除上传附件
 * DELETE /upload/:id
 */
router.delete('/:id',async function(req,res) {
  try {
    const {id} = req.params;
    if(!id) {
      throw new BadRequestError('请传递id')
    }
    const attachment = await Attachment.findByPk(id); 
    if(!attachment) {
      throw new NotFoundError(`ID:${id}的上传记录未找到`)
    }
    // 删除阿里云oss中的文件
    await client.delete(attachment.fullpath)
    await attachment.destroy();
    success(res,`ID为${id}的附件删除成功`)
  } catch (error) {
    failure(error,res)
  }
})

module.exports = router;