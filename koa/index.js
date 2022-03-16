const { append } = require('express/lib/response');
const Koa = require('./core/application');

const server1 = new Koa();
const server2 = new Koa();

server1.use(async (ctx, next) => {
  // try {
  ctx.response.body = { a: 'ok' };
  console.log(1);
  await next();
  console.log(4);
  // } catch (e) {
  //   console.log(e, 'e');
  // }

  // 对比这两个你就可以看到getter和setter的屏蔽作用了
  // console.log(ctx, 'ctx');
  // console.log(ctx.response.__proto__.__proto__, '真正的 response');
});

server1.use(async (ctx, next) => {
  console.log(2);
  throw new Error('1');
  await next();
  ctx.response.body = { a: '2ok' };
  console.log(3);
  // 对比这两个你就可以看到getter和setter的屏蔽作用了
  // console.log(ctx, 'ctx');
  // console.log(ctx.response.__proto__.__proto__, '真正的 response');
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

server1.on('error', (e) => {
  console.log('This is e ', e);
});
