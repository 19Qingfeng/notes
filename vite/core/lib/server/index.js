const connect = require('connect');
const serverStaticMiddle = require('./middleware/static');
const { resolveConfig } = require('../config');

async function createServer() {
  const middle = connect();
  const config = await resolveConfig();
  const server = {
    async listen(port) {
      require('http')
        .createServer(middle)
        .listen(port, () => {
          console.log(`vite: devServer listen on ${port}`);
        });
    },
  };
  // 静态文件中间件
  middle.use(serverStaticMiddle(config));
  return server;
}

module.exports = {
  createServer,
};
