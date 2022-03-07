const Application = require('./application')

function createApplication() {
  // Application 服务相关：提供应用注册路由接口、启动服务
  // Router 路由相关：具体路由内部逻辑实现
  return new Application()
}

module.exports = createApplication;
