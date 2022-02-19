// async代码实现 其实就是基于CO和generator函数使用
// async函数默认返回Promise 并且内部支持try catch

require('regenerator-runtime/runtime.js');

require('core-js/modules/es.object.to-string.js');

require('core-js/modules/es.promise.js');

// 首次执行 gen:iterator resolve reject _next:_next函数 _throw key:'next' value:undefined
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    // iterator.next(undefined) => { done:boolean,value:any }
    var info = gen[key](arg);
    // get value
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  // 已经完成 表示当前async函数执行完毕
  if (info.done) {
    // 直接resolve返回return的value
    resolve(value);
  } else {
    // 通过then链式处理递归
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args); // iterator
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function hello() {
  return _hello.apply(this, arguments);
}

function _hello() {
  _hello = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      var a;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return Promise.reolve();

            case 2:
              a = _context.sent;
              return _context.abrupt('return', a);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _hello.apply(this, arguments);
}

hello();
