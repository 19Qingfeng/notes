// 维护Context逻辑 本质上它是代理到了对应的Res和Req
// 相当于双重代理 当访问ctx.xx 时候会访问 ctx.request(response).xx
// 当访问ctx.request(response).xx 时又会代理带 ctx.request.req.xx
const context = {};

// 工具函数递归定义Getter Koa中使用delegates包 本质上还是__defineGetter__方法
function defineGetters(proto, target) {
  return function (key) {
    proto.__defineGetter__(key, function () {
      // 注意这里的this指向的是ctx ,ctx.__proto__.__proto__ = context
      return this[target][key];
      // 相当于 ctx.request.url 这里写的this一层一层真的绕。。
      // 1.ctx上存在直接属性request 所以访问ctx上的实例request属性 它是一个{}
      // 2.ctx.request.url ctx.request实例上本身没有url，去原型查找，两层上也就是ctx.__proto__.__proto__ 上存在对应的getter 所以会”屏蔽“效果直接执行原型上的getter
      // 3. 执行原型getter 相当于执行 this.req.url; 自然 this 指向了 ctx.request
      // 4. 相当于 ctx.request.req.url
      // 5. ctx.request实例上存在req属性并且req实例上存在url属性 直接返回
    });
  };
}

function defineSetter(proto, target) {
  return function (key) {
    proto.__defineSetter__(key, function (value) {
      this[target][key] = value;
    });
  };
}

const defineRequest = defineGetters(context, 'request');
const defineResponse = defineGetters(context, 'response');

defineRequest('url');
defineRequest('path');
defineRequest('method');
defineResponse('body');

const defineResSetter = defineSetter(context, 'response');
defineResSetter('body');

module.exports = context;
