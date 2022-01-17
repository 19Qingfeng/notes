const Promise = require('../core');

console.time('all');
const promises = [
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(3);
    });
  }, 3000),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    });
  }, 3000),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    });
  }, 3000),
  1,
];

Promise.all(promises).then(
  (res) => {
    console.timeEnd('all');
    console.log(res, 'res');
  },
  (error) => {
    console.log(error);
  }
);
