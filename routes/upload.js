const express = require('express');
const router = express.Router();
const {Attachment,User} = require('../models');
const {
  success,
  failure
} = require('../utils/reponse')
const { BadRequestError,NotFoundError } = require('../utils/errors')
const {config,client,singleFileUpload} = require('../utils/aliyun');
const {v4:uuidv4} = require('uuid');
const moment = require('moment');

/**
 * 阿里云oss云端上传
 * POST /upload
 * */
router.post('/aliyun', async function(req, res) {
  try {
    singleFileUpload(req,res,async function(error) {
      if(error) {
        return failure(error,res)
      }
      if(!req.file) {
        return failure(new BadRequestError('请选择上传的文件'),res)
      }
      await Attachment.create({
        ...req.file,
        userId:req.userId,
        fullpath:req.file.path+'/'+req.file.filename,
      })
      success(res,'上传成功',{path:req.file.url},201)
    })
  } catch (error) {
    failure(error,res)
  }
});

/**
 * 阿里云直传
 * GET /upload/aliyun_direct
 * */
router.get('/aliyun_direct',async function(req,res){
  try {
    // 有效期
    const date = moment().add(1,'days');
    // 自定义上传目录及文件名
    const key = `uploads/${uuidv4()}`;
    // 上传安全策略
    const policy = {
      expiration:date.toISOString(),// 限制有效期
      conditions:[
        ['content-length-range',0,1024*1024*10],// 限制文件大小10M
        { bucket:client.options.bucket },// 限制上传的bucket
        ['eq','$key',key],// 限制上传的文件名
        ['in','$content-type',['image/jpeg','image/png','image/gif','image/webp']]
      ]
    }
    // 签名
    const formData = await client.calculatePostSignature(policy);
    // bucket域名(阿里云上传地址)
    const host = `https://${config.bucket}.${(await client.getBucketLocation()).location}.aliyuncs.com`.toString();
    // 返回参数
    const params = {
      expire:date.format('YYYY-MM-DD HH:mm:ss'),
      policy:formData.policy,
      signature:formData.Signature,
      accessid:formData.OSSAccessKeyId,
      host,
      key,
      url:host + '/' + key,
    }
    success(res,'获取阿里云OSS授权信息成功',params)
  } catch(error) {
    failure(error,res)
  }
})

module.exports = router;