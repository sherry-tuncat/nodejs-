// multer配置信息
const multer = require('multer');
const mao = require('multer-aliyun-oss');
const oss = require('ali-oss');

const path = require('path');

// 阿里云配置信息
const config = {
  region:process.env.ALIYUN_REGION,
  accessKeyId:process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret:process.env.ALIYUN_ACCESS_KEY_SECRET,
  bucket:process.env.ALIYUN_BUCKET,
}

const client = new oss(config);

// multer配置信息
const upload = multer({
  storage:mao({
    config:config,
    destination:'uploads'
  }),
  limits:{
    fileSize:1024*1024*10 // 限制文件大小10M
  },
  fileFilter(req,file,cb){
    // 限制文件类型
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if(mimetype && extname){
      return cb(null,true);
    }
    cb(new Error('文件类型不合法'));
  }
})

// 单文件上传，制定表单字段名为file
const singleFileUpload = upload.single('file');

module.exports = {
  config,
  client,
  singleFileUpload
}