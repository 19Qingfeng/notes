const Promise = require('../core');

const withTimeout = (promise) => {
  let abort;
  const timeout = Promise.race([
    new Promise((resolve, reject) => {
      abort = reject;
    }),
    promise,
  ]);
  timeout.abort = abort;
  return timeout;
};

const promise = withTimeout(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  })
);

promise.then(
  (result) => {
    console.log('success:', result);
  },
  (error) => {
    console.log(error, '发生错误');
  }
);

setTimeout(() => {
  promise.abort('timeout');
}, 3000);
