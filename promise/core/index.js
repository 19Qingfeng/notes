// const promisesAplusTests = require('promises-aplus-tests');

const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const PENDING = 'pending';

// 核心：根据规范判断x的结果判断promise是resolve还是reject
function resolvePromise(promise, x, resolve, reject) {
  // If promise and x refer to the same object, reject promise with a TypeError as the reason.
  if (promise === x) {
    return reject(new TypeError('循环引用'));
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored
    // 按照规范 防止Then方法中返回的Promise并非严格按照规范定义的Promise，保证Promise的resolvePromise和rejectPromise仅会被调用一次（状态确认后再次重置状态无效）
    let called = false;
    try {
      // If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
      // 如果是Promise
      const then = x.then;
      if (typeof then === 'function') {
        // If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise
        // x.then 是函数直接当作Promise处理
        then.call(
          x,
          (y) => {
            // If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)
            // then中返回的 Promise 如果仍resolve一个Promise，那么应该递归处理Promise的resolve值返回给then 而不是返回这个Promise
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            // If/when rejectPromise is called with a reason r, reject promise with r.
            if (!called) {
              called = true;
              reject(r);
            }
          }
        );
      } else {
        // If then is not a function, fulfill promise with x.
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      // 同理，then报错时直接将状态重置为reject 并且不允许重置
      called = true;
      reject(e);
    }
  } else {
    // If x is not an object or function, fulfill promise with x
    resolve(x);
  }
}

// 当然还可以写一个销毁，回头有空处理。先关注核心逻辑
const mutationObserver = (cb) => {
  let count = 1;
  const observer = new MutationObserver(() => {
    cb();
  });
  const textNode = document.createTextNode(String(count));
  observer.observe(textNode, {
    // 当文本改变时触发回调
    characterData: true,
  });
  return {
    change: () => (textNode.data = String(++count)),
  };
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.reason = undefined;
    this.value = undefined;
    this.fulfillCallbacks = [];
    this.rejectedCallbacks = [];

    const resolve = (value) => {
      // 满足Promise.resolve递归处理Promise结果 并非规范内容 - start
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      // end
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.fulfillCallbacks.forEach((cb) => cb(this.value));
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.rejectedCallbacks.forEach((cb) => cb(this.reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  // 链式调用
  // 规范2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code. 表示这两个函数不应该在当前执行栈中被调用
  then(onFulfilled, onRejected) {
    // Promise 值的穿透性
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (res) => res;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (error) => {
            throw error;
          };
    let p1 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        // 原则上pending可以不用加异步处理过程，但是测试用例会检查所有onFulfilled、onRejected是否会异步调用
        this.fulfillCallbacks.push(() => {
          process.nextTick(() => {
            // const { change } = mutationObserver(() => {
            try {
              // 我需要判断上一次返回的是不是Promise
              let x = onFulfilled(this.value);
              resolvePromise(p1, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          // change();
        });
        this.rejectedCallbacks.push(() => {
          // const { change } = mutationObserver(() => {
          process.nextTick(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(p1, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          // change();
        });
      }
      if (this.status === FULFILLED) {
        // const { change } = mutationObserver(() => {
        process.nextTick(() => {
          // })
          try {
            let x = onFulfilled(this.value);
            resolvePromise(p1, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        // change();
      }
      if (this.status === REJECTED) {
        // const { change } = mutationObserver(() => {
        process.nextTick(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(p1, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        // change();
      }
    });
    return p1;
  }

  catch(errorCallback) {
    return this.then(null, errorCallback);
  }

  static all(promises) {
    const result = [];
    let counter = 0;
    return new Promise((resolve, reject) => {
      const processResult = (data, index) => {
        result[index] = data;
        if (++counter === promises.length) {
          resolve(result);
        }
      };
      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          (data) => processResult(data, index),
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  // 本质上还是借助promise的状态一经确认无法改变
  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((promise) => {
        Promise.resolve(promise).then(resolve, reject);
      });
    });
  }

  static allSettled(promises) {
    const result = [];
    let counter = 0;
    return new Promise((resolve) => {
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            result[index] = { status: 'fulfilled', value: res };
            if (++counter === promises.length) resolve(result);
          },
          (err) => {
            result[index] = { status: 'rejected', reason: err };
            if (++counter === promises.length) resolve(result);
          }
        );
      });
    });
  }

  // TODO:Finally有问题
  finally(cb) {
    return this.then(
      (value) => {
        cb();
        return value;
      },
      (error) => {
        cb();
        throw error;
      }
    );
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
}

Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;
