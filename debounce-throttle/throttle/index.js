/**
 * 节流函数 寓意阀门一样控制一定时间内函数的频繁调用
 *
 * 日常应用:
 *
 * 下拉刷新时 如果以为debounce实现显然是不合理的，使用throttle实现当用户一定时间内多次触发下拉我仅仅会调用一次函数。
 *
 * 鼠标移动时，频繁触发时候可以通过throttle在限制触发频率的同时在一定时间内限制触发给予用户反馈
 *
 * 拖拽组件时，同样可以利用throttle函数控制频率同时给予用户反馈
 */

function throttle(
  fn,
  delay = 3000,
  options = {
    leading: true,
    trailing: true,
  }
) {
  // 上一次回调的执行时间
  let lastExecTime = 0;
  // 控制最后一次是否执行
  let timer;

  function throttled(...args) {
    return new Promise((resolve, reject) => {
      // 首次需要执行
      if (lastExecTime === 0 && !options.leading) {
        lastExecTime = Date.now();
      }
      const currentTime = Date.now();
      // 下一次可以执行函数的时间
      const nextExecTime = lastExecTime + delay;
      if (currentTime - nextExecTime >= delay) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        const x = fn.apply(this, args);
        resolve(x);
        lastExecTime = Date.now();
      } else {
        if (options.trailing) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          const remainingTime = nextExecTime - currentTime;
          // 如果当前是最后一次 并且没有被执行 那么我需要在结束时候进行执行
          timer = setTimeout(() => {
            const x = fn.apply(this, args);
            resolve(x);
            lastExecTime = Date.now();
          }, remainingTime);
        }
      }
    });
  }

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return throttled;
}

const obj = {
  name: '19Qingfeng',
  logger: throttle(
    function (first) {
      console.log('执行', first);
      return 'return value';
    },
    2000,
    {
      leading: false,
      trailing: true, // 最后一次执行
    }
  ),
};
setTimeout(() => {
  obj.logger('1s');
}, 1000);

setTimeout(async () => {
  const value = await obj.logger('2s');
  console.log(value, 'This is Value');
}, 2000);
