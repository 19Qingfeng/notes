// Layer 和 Route 一对一关系

const Layer = require("./layer")

function Route() {
  // Route中维护每一个用户的实际注册路由函数
  this.stack = []
}

// 注册Route中用户真实注册的get用户函数
Route.prototype.get = function (handlers) {
  handlers.forEach(handler => {
    const layer = new Layer('*', handler)
    layer.method = 'get'
    this.stack.push(layer)
  })
}

// 分发当前Route中的馊油Layer执行
Route.prototype.dispatch = function () {

}

module.exports = Route