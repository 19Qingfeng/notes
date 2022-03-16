const http = require('http');
const EventEmitter = require('events');
const stream = require('stream');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Koa extends EventEmitter {
  constructor() {
    super();
    this.middleware = [];
    // 不同实例之间需要隔离Context 每次new Koa时的应用隔离
    // 其实我理解这里每次请求来时createContext进行控制完全是独立的
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  createContext(req, res) {
    // 每次不同的请求到来创建各自的Context实例上下文 每次请求的隔离
    const context = Object.create(this.context);
    const request = Object.create(this.request);
    const response = Object.create(this.response);
    // ctx中挂载app
    context.app = request.app = response.app = this;
    context.request = request;
    // 这里因为 request 中的Getter/Setter 属性的代理
    // 访问ctx.request.url时相当于访问ctx.request.req.url
    context.request.req = req;
    context.req = req;
    context.response = response;
    context.response.res = res;
    context.res = res;

    return context;
  }

  createServer() {
    // 2. 组合中间件
    const middleware = compose(this.middleware);
    const handleRequest = async (req, res) => {
      // 1.组装ctx
      const ctx = this.createContext(req, res);
      res.statusCode = 404;
      try {
        await middleware(ctx);
      } catch (e) {
        this.emit('error', e);
      }

      // body === ctx.response._body
      const body = ctx.body;
      if (body) {
        if (typeof body === 'string' || Buffer.isBuffer(body)) {
          return res.end(body);
        } else if (body instanceof stream) {
          return body.pipe(res);
        } else if (typeof body === 'object') {
          return res.end(JSON.stringify(body));
        }
      } else {
        res.end('Not find');
      }
    };
    return handleRequest;
  }

  listen(...args) {
    const server = http.createServer(this.createServer());
    server.listen(...args);
  }
}

module.exports = Koa;

/**
 * koa-compose
 */
function compose(middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }
  // 组合异步函数一起执行
  return function (context) {
    return dispatch(0);
    function dispatch(index) {
      // TODO: 同一中间件中多次调用next方法 以及异常处理
      if (index >= middleware.length) return Promise.resolve();
      const fn = middleware[index];
      // 保证所有中间件返回的是一个Promise对象
      // 即使该中间件没有标记为async或者返回Promise 那么该中间件还是会强行返回一个Promise
      // 提供给上一个中间件进行await处理
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, ++index)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}
