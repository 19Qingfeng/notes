var foo = {},
  F = function () {};

Object.prototype.a = 'value a';
Function.prototype.b = 'value b';

console.log(foo.a); // foo自身没有 -> foo.__proto__ => Object.prototype -> value a
console.log(foo.b); // foo自身没有 -> foo.__proto__ => Object.prototype -> 找不到了
console.log(F.a); // value a 自身找不到 -> Function.prototype.a ->  Function.prototype.__proto__.a -> Object.prototype -> valuea
console.log(F.b); // value b 自身找不到 -> Function.prototype.a ->  Function.prototype.__proto__.a -> Object.prototype -> valueb

// TODO: you dont know Js整理
