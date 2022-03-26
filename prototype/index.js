// var foo = {},
//   F = function () {};

// Object.prototype.a = 'value a';
// Function.prototype.b = 'value b';

// console.log(foo.a); // foo自身没有 -> foo.__proto__ => Object.prototype -> value a
// console.log(foo.b); // foo自身没有 -> foo.__proto__ => Object.prototype -> 找不到了
// console.log(F.a); // value a 自身找不到 -> Function.prototype.a ->  Function.prototype.__proto__.a -> Object.prototype -> valuea
// console.log(F.b); // value b 自身找不到 -> Function.prototype.a ->  Function.prototype.__proto__.a -> Object.prototype -> valueb

// // TODO: you dont know Js整理

var A = function () {};

Function.prototype.a = function () {};

Object.prototype.b = function () {};

a = new A();

console.log(A.a); // *A.__proto -> Function.prototype -> 找到
console.log(A.b); // *A.__proto -> Function.prototype ->  Function.prototype.__proto__ -> Object.prototype 找到

console.log(a.a); // !a.__proto -> A.prototype -> A.prototype.__proto__ -> Object.prototype -> 找不到
console.log(a.b); // *a.__proto -> A.prototype -> A.prototype,__proto -> Object.prototype -> 找到

// Object.__proto__ === Function.prototype true
// Function.prototype.__proto__ === Object.prototype true
// Function.__proto__ === Function.prototype  true
