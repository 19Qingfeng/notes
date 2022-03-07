// layer层的抽象概念：一个处理方法就可以用作一层
function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
}

// 抽离层设计，避免直接访问类属性 通过方法暴露
Layer.prototype.match = function (pathname) {
  return this.path === pathname;
};

Layer.prototype.handleRequest = function (req, res, next) {
  this.handler(req, res, next);
};

module.exports = Layer;
