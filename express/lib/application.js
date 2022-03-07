const Router = require('./router')
const http = require('http')

// 抽象应用逻辑管理
function Application() {
  // 初始化路由系统
  this.router = new Router()
}

Application.prototype.get = function (path, ...handlers) {
  this.router.get(path, handlers)
}

Application.prototype.listen = function () {
  const server = http.createServer((req, res) => {
    // 抽象路由管理，应用并不关心路径匹配。那是路由做的事情
    function done() {
      res.end(`Cannot ${req.url} ${req.method}`)
    }
    this.router.handler(req, res, done)
  })
  server.listen(...arguments)
}

module.exports = Application