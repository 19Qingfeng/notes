// function* name() {
//   const a = yield 'hello';
//   console.log(a);
//   const b = yield 'world';
//   console.log(b);
//   const c = yield '19Qingfeng';
//   console.log(c);
// }

// const nameStep = name();

// nameStep.next('hello');

//  babel编译后的代码
// require('regenerator-runtime/runtime.js');

const regeneratorRuntime = {
  mark: function (gen) {
    return gen;
  },
  wrap: function (iteratorFn) {
    const context = {
      next: 0, // 表示下一次执行时候状态机switch中的下标
      done: false, // 表示当前generator是否迭代完成
      sent: '', // 表示next调用时候传入的值 作为上一次yield返回值
      stop: function () {
        // 表示停止
        this.done = true;
      },
    };
    return {
      next(value) {
        // 1. 修改上一次yield返回值为context.sent
        context.sent = value;
        // 2.执行函数 获得返回值
        const v = iteratorFn(context);
        return {
          value: v,
          done: context.done,
        };
      },
    };
  },
};

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(name);

function name() {
  var a, b, c;
  return regeneratorRuntime.wrap(function name$(_context) {
    while (1) {
      // while(1) 在开发中表示该函数会被调用并非一次，实际上并不存在什么实际意义
      switch ((_context.prev = _context.next)) {
        case 0:
          _context.next = 2;
          return 'hello';

        case 2:
          a = _context.sent;
          console.log(a);
          _context.next = 6;
          return 'world';

        case 6:
          b = _context.sent;
          console.log(b);
          _context.next = 10;
          return '19Qingfeng';

        case 10:
          c = _context.sent;
          console.log(c);

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

var nameStep = name();
console.log(nameStep.next());
console.log(nameStep.next('hello1'));
console.log(nameStep.next('hello2'));
console.log(nameStep.next('hello3'));
console.log(nameStep.next('hello4'));
