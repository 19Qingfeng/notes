const Router = require('./router');
const http = require('http');
const methods = require('methods');

// 抽象应用逻辑管理
function Application() {
  // 创建路由系统
  this.router = new Router();
}

methods.concat('all').forEach((method) => {
  Application.prototype[method] = function (path, ...handlers) {
    // 路由系统中注册对应Router Layer
    this.router[method](path, handlers);
  };
});

Application.prototype.listen = function () {
  // 抽象路由管理，应用并不关心路径匹配。那是路由做的事情
  function done(req, res) {
    res.end(`Cannot ${req.url} ${req.method}`);
  }
  const server = http.createServer((req, res) => {
    this.router.handler(req, res, done);
  });
  server.listen(...arguments);
};

module.exports = Application;
