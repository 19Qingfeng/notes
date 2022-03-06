// const express = require('./express');
const express = require('../index');

const app = express();

app.get('/', (req, res, next) => {
  // res.send('end');
  console.log('进入');
  res.end('hello');
});

app.listen(3000, () => {
  console.log('server listen on 3000');
});
