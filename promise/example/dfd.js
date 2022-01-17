const Promise = require('../core');
const fs = require('fs');
const path = require('path');

const readFile = () => {
  const dfd = Promise.deferred();
  fs.readFile(
    path.resolve(__dirname, '../core/index.js'),
    'utf8',
    (error, result) => {
      if (error) {
        dfd.reject(error);
        return;
      }
      dfd.resolve(result);
    }
  );
  return dfd.promise;
};

readFile().then(
  (res) => {
    console.log(res, 'res');
  },
  (e) => {
    console.log(e);
  }
);
