// Layer 和 Route 一对一关系
const Layer = require('./layer');
const methods = require('methods');

function Route() {
  // Route中维护每一个用户的实际注册路由函数
  this.stack = [];
  this.method = {};
}

// 注册Route中用户真实注册的用户函数
methods.concat('all').forEach((method) => {
  Route.prototype[method] = function (handlers) {
    // 额外缓存 防止相同路径不存在方法时多次调用 比如我仅仅存在 / 的get路径，你调用/的delete方法。此时不应该进入执行。
    // 因为外层仅仅判断了路径，路径相同就会进来。所以我要额外标记当前Route存在的方法，只有方法也存在才会进入内层寻找。
    this.method[method] = true;
    handlers.forEach((handler) => {
      const layer = new Layer('*', handler);
      // Route中layer仅仅根据method区分触发对应逻辑
      layer.method = method;
      this.stack.push(layer);
    });
  };
});

// 分发当前Route中的所有Layer执行 匹配路径下的详细处理Method管理
Route.prototype.dispatch = function (req, res, out) {
  const requestMethod = req.method.toLowerCase();
  // 继续调用内部stack
  let idx = 0;
  const next = () => {
    if (idx >= this.stack.length) return out();
    const layer = this.stack[idx++];
    if (layer.method === requestMethod || requestMethod === 'all') {
      layer.handleRequest(req, res, next);
    } else {
      next();
    }
  };
  next();
};

module.exports = Route;
