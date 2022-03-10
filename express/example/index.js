const express = require('express');
// const express = require('../index');

const app = express();

// 中间件也支持路径参数
// 中间件支持路径参数时是模糊匹配 比如当请求路径 /a/b 时，中间件/a也会触发
// 而路由中间件则不会，它是精确匹配
app.use('/', function (req, res, next) {
  console.log('1');
  next();
  console.log('2');
});

app.use('/', function (req, res, next) {
  console.log('3');
  next();
  console.log('4');
});

app.use('/', function (req, res, next) {
  console.log('5');
  next();
  console.log('6');
});

app.get('/', (req, res) => {
  res.end('end');
});

// app.get(
//   '/',
//   (req, res, next) => {
//     console.log('111');
//     next();
//   },
//   function (req, res, next) {
//     console.log('2');
//     next();
//   },
//   function (req, res, next) {
//     console.log('3');
//     next();
//   },
//   function (req, res, next) {
//     console.log('4');
//     res.end('end with 3');
//   }
// );

// app.post(
//   '/a',
//   (req, res, next) => {
//     console.log('111');
//     next();
//   },
//   function (req, res, next) {
//     console.log('2');
//     next();
//   },
//   function (req, res, next) {
//     console.log('3');
//     next();
//   },
//   function (req, res, next) {
//     console.log('4');
//     res.end('end with post');
//   }
// );

app.listen(3000, () => {
  console.log('server listen on 3000');
});
