const Promise = require('../core');

// Promise.resolve(new Promise((resolve, reject) => reject(3))).then(
//   (res) => {
//     console.log(res);
//   },
//   (error) => {
//     console.log(error, 'error');
//   }
// );

Promise.reject(new Promise((resolve, reject) => resolve(3))).then(
  (res) => {
    console.log(res);
  },
  (error) => {
    console.log(error, 'error');
  }
);
