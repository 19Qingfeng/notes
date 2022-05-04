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

a = new A();

Function.prototype.a = function () {};

Object.prototype.b = function () {};

// new 调用 a.__proto__ -> A.prototype -> A.prototype.__proto__
a = new A();

console.log(A.a); // *A.__proto -> Function.prototype -> 找到
console.log(A.b); // *A.__proto -> Function.prototype ->  Function.prototype.__proto__ -> Object.prototype 找到

// ! 注意这里是  A.prototype.__proto__ (这是一个对象)  指向的是 Object.prototype
// ! 而 A.__proto__ (根据继承关系) 指向的是 Function.prototype
console.log(a.a); // !a.__proto -> A.prototype -> A.prototype.__proto__ -> Object.prototype -> 找不到
console.log(a.b); // *a.__proto -> A.prototype -> A.prototype,__proto -> Object.prototype -> 找到

// Object.__proto__ === Function.prototype true
// Function.prototype.__proto__ === Object.prototype true
// Function.__proto__ === Function.prototype  true
