const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Koa {
  constructor() {
    // 不同实例之间需要隔离Context 每次new Koa时的应用隔离
    // 其实我理解这里每次请求来时createContext进行控制完全是独立的
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  use(middleware) {
    this.fn = middleware;
  }

  createContext(req, res) {
    // 每次不同的请求到来创建各自的Context实例上下文 每次请求的隔离
    const context = Object.create(this.context);
    const request = Object.create(this.request);
    const response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.request = request;
    // 这里因为 request 中的Getter/Setter 属性的代理
    // 访问ctx.request.url时相当于访问ctx.request.req.url
    context.request.req = req;
    context.req = req
    return context;
  }

  createServer() {
    // 2. 组合中间件 TODO:等待整理
    // const fn = () => {};
    const handleRequest = (req, res) => {
      // 1.组装ctx
      const ctx = this.createContext(req, res);
      // return this.handleRequest(ctx, fn);
      this.fn(ctx);
    };
    return handleRequest;
  }

  listen(...args) {
    const server = http.createServer(this.createServer());
    server.listen(...args);
  }
}

module.exports = Koa;
