const connect = require('connect');
const serverStaticMiddle = require('./middleware/static');
const { resolveConfig } = require('../config');
const { createOptimizerDepsRun } = require('../optimizer');

async function createServer() {
  console.log(connect, 'connect');
  const middle = connect();
  const config = await resolveConfig();

  const server = {
    async listen(port) {
      require('http')
        .createServer(middle)
        .listen(port, async () => {
          await runOptimizer(config, server);
          console.log(`vite: devServer listen on ${port}`);
        });
    },
  };
  // 静态文件中间件
  middle.use(serverStaticMiddle(config));
  return server;
}

// 分析依赖进行优化 预编译
const runOptimizer = async (config, server) => {
  const optimizeDeps = await createOptimizerDepsRun(config);
  server._optimizeDeps = optimizeDeps.metaData;
};

module.exports = {
  createServer,
};
