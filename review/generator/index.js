function promise1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('1');
    }, 1000);
  });
}

function promise2(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('value:' + value);
    }, 1000);
  });
}

function* readFile() {
  const value = yield promise1();
  const result = yield promise2(value);
  return result;
}

function co(gen) {
  return new Promise((resolve, reject) => {
    const g = gen();
    function next(param) {
      const { done, value } = g.next(param);
      if (!done) {
        // 未完成 继续递归
        Promise.resolve(value).then((res) => next(res));
      } else {
        // 完成直接重置 Promise 状态
        resolve(value);
      }
    }
    next();
  });
}
co(readFile).then((res) => console.log(res));
