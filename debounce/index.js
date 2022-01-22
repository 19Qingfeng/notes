/**
 * 防抖原理
 * 事件触发时并不会立即执行，会等待一段时间没有重复调用才会执行
 * 如果在等待期间再次触发事件，才会继续执行
 * 只有在等待期间没有继续调用才会执行回调
 *
 * 应用场景
 * 输入框搜索时
 * 重复点击按钮时
 * 滚动刷新频繁触发
 * 缩放窗口时
 *
 */

function debounce(fn, delay, immediate = false, callback) {
  let timer;
  // 是否首次调用过
  let immediateInvoke = false;
  const debounced = function (...args) {
    return new Promise((resolve, reject) => {
      if (timer) clearTimeout(timer);
      if (immediate && !immediateInvoke) {
        const x = fn.apply(this, args);
        immediateInvoke = true;
        resolve(x);
        if (callback) {
          callback(x);
        }
      }
      timer = setTimeout(() => {
        const x = fn.apply(this, args);
        resolve(x);
        if (callback) {
          callback(x);
        }
      }, delay * 1000);
    });
  };
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return debounced;
}

const obj = {
  name: '19Qingfeng',
  // 此时如果我的logger函数存在返回值 我希望debounce可以拿到返回值
  logger: debounce(
    function (first) {
      console.log(this.name);
      console.timeEnd('start');
      console.log(first, 'first');
      return 'return value';
    },
    2,
    false,
    (value) => {
      console.log('debounce callback 返回值', value);
    }
  ),
};
console.time('start');
setTimeout(() => {
  obj.logger('123');
}, 1000);
// setTimeout(() => {
//   obj.logger('123');
// }, 2000);
// setTimeout(() => {
//   obj.logger('123');
// }, 3000);
// setTimeout(() => {
//   obj.logger('123');
// }, 4000);
// setTimeout(async () => {
//   obj.logger('123');
//   // 取消执行
//   // obj.logger.cancel();
// }, 5000);
