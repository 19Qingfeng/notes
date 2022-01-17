const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
function resolvePromise(promise, x, resolve, reject) {
  // x可能是别人家的promise
  // 用x的值来决定promise走 resolve还是reject
  // 核心就是用x 来处理promise是成功还是失败
  // 我们要考虑不同人写的promise可以互相兼容，所以这里要按照规范来实现，保证promise直接可以互相调用

  // 判断x 是不是一个promise 是promise就采用他的状态，如果解析后还是promise会递归解析
  if (promise == x) {
    return reject(
      new TypeError(
        `TypeError: Chaining cycle detected for promise #<myPromise> `
      )
    );
  }
  // 判断x 是不是一个promise， 如果不是promise，则直接用这个值将promise变成成功态即可
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false;
    try {
      let then = x.then; // 这个x可能是通过defineProperty定义的then
      if (typeof then === 'function') {
        // 这已经最小判断
        // x.then((y)=>{},r=>{}) // x.then 会再去取then
        // 这个then方法可能是别人家的promise, 没有处理同时调用成功和失败方法
        then.call(
          x,
          (y) => {
            // 如果x是一个promise就用他的状态来决定 走成功还是失败
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject); //递归解析y的值
          },
          (r) => {
            // 一旦失败了 就不在解析失败的结果了
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // {} / function 没有then方法 依旧是普通值  {then:123}
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 不是对象和函数 普通值
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    this.status = PENDING; // promise的默认状态
    this.value = undefined; // 成功的值和失败的原因
    this.reason = undefined;

    this.onResolvedCallbacks = []; // 这里存放所有成功的回调
    this.onRejectedCallbacks = []; // 所有失败的回调
    const resolve = (value) => {
      // 更改状态的方法 resolve
      if (value instanceof Promise) {
        // 这个不属于规范
        return value.then(resolve, reject);
      }
      if (this.status == PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.onResolvedCallbacks.forEach((cb) => cb(this.value));
      }
    };
    const reject = (reason) => {
      // 更改状态的方法 reject
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
      }
    };
    try {
      executor(resolve, reject); // executor就是执行器立刻执行，出错就调用reject
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    // 调用then的时候会判断是成功还是失败
    // 可以不停的then下去
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e;
          };
    // mutationObserver
    let p1 = new Promise((resolve, reject) => {
      // x是一个普通值 则将这个值直接传入到resolve函数中即可
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(p1, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(p1, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status == PENDING) {
        // 发布订阅  有可能调用then的时候没成功也没失败，我就将回调存起来，稍后根据用户调用的方法在进行执行
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(p1, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(p1, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return p1; // 这里没有返回this
  }
  // // 类本身调用的叫静态方法
  // static resolve(value) {
  //   return new Promise((resolve, reject) => {
  //     resolve(value);
  //   });
  // }
  // static reject(value) {
  //   // 默认创建一个失败的promise
  //   return new Promise((resolve, reject) => {
  //     reject(value);
  //   });
  // }
  // static all = function (promises) {
  //   let result = [];
  //   let times = 0;
  //   return new Promise((resolve, reject) => {
  //     function processResult(data, index) {
  //       result[index] = data; // 映射结果
  //       if (++times == promises.length) {
  //         resolve(result);
  //       }
  //     }
  //     for (let i = 0; i < promises.length; i++) {
  //       let promise = promises[i];
  //       Promise.resolve(promise).then((data) => {
  //         processResult(data, i);
  //       }, reject);
  //     }
  //   });
  // };
  // catch(errCallback) {
  //   return this.then(null, errCallback);
  // }
  // static race = function (promises) {
  //   return new Promise((resolve, reject) => {
  //     for (let i = 0; i < promises.length; i++) {
  //       let promise = promises[i];
  //       Promise.resolve(promise).then(resolve, reject); // 只要成功了就不能在失败，只要失败了就不能在成功
  //     }
  //   });
  // };
}
Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
// 这里会拿到此方法的返回结果来测试是否符合规范

// npm install promises-aplus-test -g 全局安装都是在命令行中使用

// promises-aplus-test 测试的文件名

// function promisify(fn) {
//   // fs.readFile
//   return function (...args) {
//     // readFile
//     return new Promise((resolve, reject) => {
//       fn(...args, function (err, data) {
//         if (err) return reject(err);
//         resolve(data);
//       });
//     });
//   };
// }
// function promisifyAll(obj) {
//   let result = {};
//   for (let key in obj) {
//     // 判断值是不是一个函数，是函数就转化成promise
//     result[key] =
//       typeof obj[key] === 'function' ? promisify(obj[key]) : obj[key];
//   }
//   return result;
// }

module.exports = Promise;
