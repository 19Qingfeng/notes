// 抽象路由管理内容

const { parse } = require("url")

function Router() {
  // Router中的核心思路就是通过get、post等方法保存相应信息在栈中，当请求到来时候去栈中对比参照到匹配的逻辑执行
  this.stack = []
}

Router.prototype.get = function (path, handler) {
  this.stack.push({
    path,
    method: 'get',
    handler
  })
}

/**
 * 
 * @param {*} req 请求信息
 * @param {*} res 响应信息
 * @param {*} out 当无法匹配时调用的callback
 */
Router.prototype.handler = function (req, res, out) {
  // 寻找stack来处理
  const requestMethod = req.method.toLowerCase()
  const { pathname } = parse(req.url)
  for (let i = 0; i < this.stack.length; i++) {
    const { method, handler, path } = this.stack[i]
    if (method === requestMethod && pathname === path) {
      return handler(req, res)
    }
  }
  out(req, res)
}


module.exports = Router