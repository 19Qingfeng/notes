// layer层的抽象概念：一个处理方法就可以用作一层
function Layer(path, handler) {
  this.path = path
  this.handler = handler
}

module.exports = Layer