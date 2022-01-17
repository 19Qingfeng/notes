const Promise = require('./core/index');

const promise = new Promise((resolve, reject) => {
  // setTimeout(() => {
  resolve('hello promise');
  // }, 1000);
  // reject('err');
});

promise.then(
  (value) => {
    return `100`;
  },
  (error) => {
    console.log(error, 'e');
    // console.log('error1', error);
    // throw new Error('hello');
    // console.log(error, 'error');
    return 'wang.haoyu';
  }
);
// .then(
//   (value) => {
//     console.log(value, 'value2');
//   },
//   (error) => {
//     console.log(error.message, 'this is a error');
//   }
// );

// promise
//   .then(
//     (value) => {
//       throw new Error('then throw error');
//     },
//     (error) => {
//       console.log(error, 'error');
//     }
//   )
//   .then(
//     () => {},
//     (reason) => {
//       console.log('错误', reason);
//     }
//   );

module.exports = Promise;
