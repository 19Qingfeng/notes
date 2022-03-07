// const express = require('express');
const express = require('../index');

const app = express();

app.get('/', (req, res, next) => {
  console.log('1');
  next()
  res.end('hello');
}, function (req, res, next) {
  console.log('2')
  next()
}, function (req, res, next) {
  console.log('3')
  res.end('end with 3')
});

app.listen(3000, () => {
  console.log('server listen on 3000');
});

