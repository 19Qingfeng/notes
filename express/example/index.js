// const express = require('express');
const express = require('../index');

const app = express();

app.get(
  '/',
  (req, res, next) => {
    console.log('111');
    next();
  },
  function (req, res, next) {
    console.log('2');
    next();
  },
  function (req, res, next) {
    console.log('3');
    next();
  },
  function (req, res, next) {
    console.log('4');
    res.end('end with 3');
  }
);

app.post(
  '/a',
  (req, res, next) => {
    console.log('111');
    next();
  },
  function (req, res, next) {
    console.log('2');
    next();
  },
  function (req, res, next) {
    console.log('3');
    next();
  },
  function (req, res, next) {
    console.log('4');
    res.end('end with post');
  }
);

app.listen(3000, () => {
  console.log('server listen on 3000');
});
