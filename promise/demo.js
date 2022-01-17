const Promise = require('./core/index');

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('hello promise');
  }, 1000);
});

promise.then(
  (value) => {
    console.log(`${value}!success then`);
    return `${value}!success then`;
  },
  (error) => {
    console.log(error, 'error');
  }
);

promise.then(
  (value) => {
    // throw new Error('then throw error');
    console.log(`${value}!success then`);
    return `${value}!success then`;
  },
  (error) => {
    console.log(error, 'error');
  }
);

module.exports = Promise;
