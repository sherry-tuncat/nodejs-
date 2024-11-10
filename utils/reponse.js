/*
* 返回成功信息
* */
function success(res,message,data,code=200) {
  res.status(code).json({
    code:0,
    success:true,
    message,
    data
  })
}

/*
* 返回错误信息
* */
const errorsType = {
  BadRequestError:400, // 400 请求错误
  UnauthorizedError:401, // 401 认证失败
  
  NotFoundError:404 // 404 资源不存在
}
function failure(error,res) {
  if(error.name==='SequelizeValidationError') {
    const errors = error.errors.map(err=>err.message);
    return res.status(400).json({
      code:1,
      success:false,
      errors
    })
  }
  if(error.name==='JsonWebTokenError') {
    return res.status(401).json({
      code:1,
      success:false,
      errors:['您提交的token错误']
    })
  }
  if(error.name==='TokenExpiredError') {
    return res.status(401).json({
      code:1,
      success:false,
      errors:['您提交的token已过期']
    })
  }
  if(errorsType[error.name]) {
    return res.status(errorsType[error.name]).json({
      code:1,
      success:false,
      errors:[error.message]
    })
  }
  res.status(error.status || 500).json({
    code:1,
    success:false,
    errors: [error.message] || error
  });
}

module.exports = {
  success,
  failure
}