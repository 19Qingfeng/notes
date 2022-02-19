const fs = require('fs').promises;
const path = require('path');

function* read() {
  const filename = yield fs.readFile(
    path.resolve(__dirname, './text/text1.txt'),
    'utf-8'
  );
  const content = yield fs.readFile(
    path.resolve(__dirname, `./text/${filename}`),
    'utf-8'
  );
  return content;
}

function co(gen) {
  return new Promise((resolve, reject) => {
    const iterator = gen();
    function next(v) {
      // 非Promise处理成为Promise
      const { value, done } = iterator.next(v);
      if (!done) {
        Promise.resolve(value)
          .then((res) => {
            next(res);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve(value);
      }
    }
    next();
  });
}

co(read)
  .then((res) => console.log(res, 'res'))
  .catch((error) => console.log(error, 'error'));
