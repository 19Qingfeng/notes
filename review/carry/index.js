// TODO:明天再次实现柯里化

// 柯利化函数
function curry(fn) {
  return function curried(...rest) {
    return fn.length === rest.length
      ? fn(...rest)
      : (...args) => curried(...rest, ...args);
  };
}

// 普通的add函数
function add(x, y, z) {
  return x + y + z;
}

const curryingAdd = curry(add);

console.log(add(1, 2, 3)); // 3
console.log(curryingAdd(1)(2)(3)); // 3

// TODO:实现反柯里化 查阅文章搞懂反柯里化深层作用

function unCurry(fn) {
  return (...args) => {
    fn.apply(args.shift(), args);
  };
}

const unCurryPush = unCurry([].push);

const obj = {
  1: 'hello',
};
unCurryPush(obj, 'test');
unCurryPush(obj, 'test1');

console.log(obj);
