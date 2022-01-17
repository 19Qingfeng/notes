const Promise = require('../core');

const createPromise = (timeout, isReject = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isReject ? reject('error') : resolve('success');
    }, timeout * 1000);
  });
};

Promise.allSettled([
  createPromise(1),
  createPromise(2, true),
  createPromise(1),
]).then((res) => {
  console.log(res, 'res');
});
