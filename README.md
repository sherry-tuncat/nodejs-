## Nodejs 全栈实践项目

### 项目介绍

- 后端：Nodejs + Express + Jwt
- 数据库：Mysql

### 配置环境变量

将`.env.example`文件复制一份命名为`.env`，并修改配置。

```
NODE_DEV = development
PORT = 3000
SECRET = 你的密钥
```

其中`NODE_DEV`默认为开发环境，其中`PORT`配置为服务端口，`SECRET`配置为 jwt 加密密钥`

### 生成密钥

在命令行中启动 node

进入交互模式后，运行

```
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'))

```

将获取到的密钥粘贴到.env 中的`SECRET`字段中

### 配置数据库

项目使用 Docker 容器运行 MySQL 数据库。安装好 Docker 后，可直接启动 MySQL.

```
docker-compose up -d
```

如需使用自行安装的 MySQL，请自行配置数据库连接配置文件`config/config.js`文件中的数据库用户名和密码。

```
{
  "development":{
    "username":"xxx",
    "password":"xxx"
  }
}
```

### 安装与运行

```
# 安装依赖
npm i
# 创建数据库
npx sequelize-cli db:create --charset utf8mb4 --collate utf8mb4_general_ci
# 运行迁移，自动建表
npx sequelize-cli db:migrate
# 运行种子，填充初始数据
npx sequelize-cli db:seed:all
# 启动项目
npm start
```

访问地址:http://localhost:PORT，详情看接口文档

### 初始管理员信息

```
username：sherry
密码：admin123
```

### 项目启动

- 后端启动
  - `npm start`

###
