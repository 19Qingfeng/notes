// 抽象路由管理内容

const { parse } = require("url")
const Layer = require("./layer")
const Route = require("./route")

function Router() {
  // Router中的核心思路就是通过get、post等方法保存相应信息在栈中，当请求到来时候去栈中对比参照到匹配的逻辑执行
  this.stack = []
}

Router.prototype.route = function (path) {
  const route = new Route()
  // 关联route和layer
  const layer = new Layer(path, route.dispatch.bind(route))
  // 通过路由注册的中间件 每个层中存在一个route属性
  layer.route = route
  this.stack.push(layer) // 添加layer进入stack
  return route
}

Router.prototype.get = function (path, handlers) {
  // 创建Route对象push进入layer
  const route = this.route(path)
  // 将当前路由中间件中所有的callback注册到当前route中
  route.get(handlers)
}

/**
 * 
 * @param {*} req 请求信息
 * @param {*} res 响应信息
 * @param {*} out 当无法匹配时调用的callback
 */
Router.prototype.handler = function (req, res, out) {
  // TODO:等待修改
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