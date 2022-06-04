const static = require('serve-static');

function serverStaticMiddle(config) {
  // config.root 作为跟路径启动静态资源服务器
  return static(config.root);
}

module.exports = serverStaticMiddle;
