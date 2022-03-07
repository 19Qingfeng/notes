// 抽象路由管理内容

const { parse } = require('url');
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods');

function Router() {
  // Router中的核心思路就是通过get、post等方法保存相应信息在栈中，当请求到来时候去栈中对比参照到匹配的逻辑执行
  this.stack = [];
}

Router.prototype.route = function (path) {
  const route = new Route();
  // 关联route和layer
  const layer = new Layer(path, route.dispatch.bind(route));
  // 通过路由注册的中间件 每个层中存在一个route属性
  layer.route = route;
  this.stack.push(layer); // 添加layer进入stack
  return route;
};

methods.forEach((method) => {
  Router.prototype[method] = function (path, handlers) {
    // 创建Route对象push进入layer
    const route = this.route(path);
    // 将当前路由中间件中所有的callback注册到当前route中
    route[method](handlers);
  };
});

/**
 * 分发Router管理的最外层路径匹配的Layer执行
 * @param {*} req 请求信息
 * @param {*} res 响应信息
 * @param {*} out 当无法匹配时调用的callback
 */
Router.prototype.handler = function (req, res, out) {
  // 寻找stack来处理
  const { pathname } = parse(req.url);
  // 每次拿出来当前stack中的layer 同时layer中还有stack
  // TODO: next递归回调传入外部callback 其实内部感觉有点IteratorNormalLoader的函数感觉
  // tj这里写的很精髓这里的代码思路，在很多库内部都使用过。牢记思路
  let idx = 0;
  const next = () => {
    if (idx >= this.stack.length) return out(req, res);
    // 找到当前Router中的满足layer
    const layer = this.stack[idx++];
    if (layer.match(pathname) && layer.route.method[req.method.toLowerCase()]) {
      // 匹配到交给内部Route处理，当Route内部调用next后才会继续往后执行
      layer.handleRequest(req, res, next);
    } else {
      next();
    }
  };

  next();
};

module.exports = Router;
