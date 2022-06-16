const http = require('http');
const path = require('path');
// const connect = require('connect');
const serveStatic = require('serve-static');

function connect() {
  const middleware = [];

  const handler = (req, res) => {
    // 依次执行中间件
    let index = 0;
    function next(req, res) {
      middleware[index++](req, res, next);
    }

    next(req, res);
  };

  handler.use = function (middle) {
    middleware.push(middle);
  };

  return handler;
}

const app = connect();

app.use(serveStatic(path.resolve(__dirname, 'public')));

app.use((req, res, next) => {
  console.log('middle');
  next();
});

app.use((req, res, next) => {
  console.log('middle2');
});

http.createServer(app).listen(3001, () => console.log('server on 3001'));
