const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// 引入全局变量
require('dotenv').config();

// 中间件
const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');

// 前台路由文件
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');
const articlesRouter = require('./routes/articles');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const likesRouter = require('./routes/likes');
const authRouter = require('./routes/auth');

// 后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// cors跨域配置(注意位置要在其他路由前面)
app.use(cors({
  origin:['http://localhost:3000','http://127.0.0.1:5500']
}));



// 前台路由配置
app.use('/index',userAuth, indexRouter);
app.use('/users',userAuth, usersRouter);
app.use('/categories',userAuth,categoriesRouter);
app.use('/courses',userAuth,coursesRouter);
app.use('/chapters',userAuth,chaptersRouter);
app.use('/articles',userAuth,articlesRouter);
app.use('/settings',userAuth,settingsRouter);
app.use('/search',userAuth,searchRouter);
app.use('/likes',userAuth,likesRouter);
app.use('/auth',authRouter);

// 后台路由配置
app.use('/admin/articles',adminAuth, adminArticlesRouter);
app.use('/admin/categories',adminAuth, adminCategoriesRouter);
app.use('/admin/settings',adminAuth, adminSettingsRouter);
app.use('/admin/users',adminAuth, adminUsersRouter);
app.use('/admin/courses',adminAuth, adminCoursesRouter);
app.use('/admin/chapters',adminAuth, adminChaptersRouter);
app.use('/admin/charts',adminAuth, adminChartsRouter);
app.use('/admin/auth', adminAuthRouter);

module.exports = app;
