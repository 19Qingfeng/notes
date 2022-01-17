const Promise = require('../core');

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('error');
  }, 1000);
});

p1.finally(() => {
  console.log('hello');
})
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e, 'e');
  });
