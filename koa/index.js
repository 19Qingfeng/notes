const Koa = require('./core/application');

const server1 = new Koa();
const server2 = new Koa();

server1.use((ctx) => {
  console.log(ctx.request.path); // 存在
  console.log(ctx.req.path, 'url'); // 不存在
  console.log(ctx.request.req.path, 'url'); // 不存在
  console.log(ctx.path) // 存在
});

server2.use((ctx) => {
  console.log(ctx.name, 'server 2');
});

server1.listen(3001, () => {
  console.log('server1 on 3001');
});

server2.listen(3002, () => {
  console.log('server2 on 3002');
});
