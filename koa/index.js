const Koa = require('./core/application');

const server1 = new Koa();
const server2 = new Koa();

server1.use((ctx) => {
  ctx.response.body = 'ok';
});

server2.use((ctx) => {
  console.log(ctx.name, 'server 2');
});

server1.listen(2998, () => {
  console.log('server1 on 2998');
});

server2.listen(2999, () => {
  console.log('server2 on 2999');
});
