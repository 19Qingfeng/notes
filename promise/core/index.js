const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const PENDING = 'pending';

// 核心：根据规范判断x的结果判断promise是resolve还是reject
function resolvePromise(promise, x, resolve, reject) {
  console.log(promise, 'promise');
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
    let p1 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        // 原则上pending可以不用加异步处理过程，但是测试用例会检查所有onFulfilled、onRejected是否会异步调用
        this.fulfillCallbacks.push(() => {
          const { change } = mutationObserver(() => {
            try {
              // 我需要判断上一次返回的是不是Promise
              let x = onFulfilled(this.value);
              resolvePromise(p1, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          change();
        });
        this.rejectedCallbacks.push(() => {
          const { change } = mutationObserver(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(p1, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          change();
        });
      }
      if (this.status === FULFILLED) {
        const { change } = mutationObserver(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(p1, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        change();
      }
      if (this.status === REJECTED) {
        const { change } = mutationObserver(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(p1, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        change();
      }
    });
    return p1;
  }
}

// module.exports = Promise;
