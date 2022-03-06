// const Application = require('./')
const http = require('http');
const url = require('url');

let routes = [];

function createApplication() {
  return {
    get(path, handler) {
      routes.push({
        path,
        method: 'get',
        handler,
      });
    },
    listen() {
      const server = http.createServer((req, res) => {
        // 这里应该处理下
        routes.forEach((route) => {
          const { method, path, handler } = route;
          const requestMethod = req.method.toLocaleLowerCase();
          const { pathname } = url.parse(req.url);
          if (pathname === path && requestMethod === method) {
            // 相等的话
            handler(req, res);
          }
        });
      });
      server.listen(...arguments);
    },
  };
}

module.exports = createApplication;
