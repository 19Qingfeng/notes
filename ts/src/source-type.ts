// // 获取函数参数类型
// type CustomParameters<T extends Function> = T extends (
//   ...params: infer R
// ) => unknown
//   ? R
//   : never;

// // 返回值类型
// type CustomReturnType<T extends Function> = T extends (
//   ...params: any[]
// ) => infer R
//   ? R
//   : never;

// function b(a: number) {
//   return 1;
// }
// type BFn = typeof b;
// type B = CustomReturnType<BFn>;

// type Params = CustomParameters<typeof b>;

let a: number = 1;
let c: any = a;

let d: unknown = a;

// // TS 中的分发、循环、协变、逆变 总结文章1

// type ExcludeType<T, K> = T extends K ? never : T;

// const a: string = '1';
// a.toString();
// type B = Record<number | string, number>;
// interface B {
//   private a(): void;
// }

// type A<T> = {
//   [key in keyof T]: T[key];
// };

// type C = Pick<A, 'string'>;

// // 函数的参数是逆变
// let fn1!: (a: { a: string }) => string;
// let fn2!: (a: { a: string; b: number }) => string;

// fn2 = fn1;

// // 元祖 -> 联合类型
// let aa!: [string, number, boolean];

// type TransformUnion<T> = T extends Array<infer R> ? R : never;

// type cc = TransformUnion<typeof aa>;

// // 联合类型 -> 元祖
// let dd!: string | number | boolean;

// // type TransformArr<T> = T extends // 是否是联合类型 [...infer R]

let aaa!: any;
let bbb!: unknown;

// // 任何值都可以赋给any、unknown
aaa = 1;
bbb = 1;

// 任何类型都可以赋给any,但不可以类型不可以赋给unknown

// type eee = string | boolean;

// let cccc!: eee;

function testFunction(val: number): void {}

testFunction(aaa);
testFunction(bbb);

// type CCCCC = unknown | string;

// function identity<T = string>(arg: T): T {
//   return arg;
// }

// // 调用identity时传入name，函数会自动推导出泛型T为string，自然arg类型为T，返回值类型也为T
// // const userName = identity('name');
// // // 同理，当然你也可以显示声明泛型
// // const id = identity<number>(1);

// // // 定义一个泛型接口 IPerson表示一个类，它返回的实例对象取决于使用接口时传入的泛型T
// // interface IPerson<T> {
// //   // 因为我们还没有讲到unknown 所以暂时这里使用any 代替
// //   new (...args: unknown[]): T;
// // }

// // function getInstance<T>(Clazz: IPerson<T>) {
// //   return new Clazz();
// // }

// // // use it
// // class Person {}

// // // TS推断出函数返回值是person实例类型
// // const person = getInstance(Person);

// // 声明一个接口IPerson代表函数
// interface IPerson<T> {
//   // 此时注意泛型是在函数中参数 而非在IPerson接口中
//   (a: T): T;
// }

// // 函数接受泛型
// const getPersonValue: IPerson<string> = <T>(a: T): T => {
//   return a;
// };

// // 相当于getPersonValue<number>(2)
// getPersonValue(2);
// // 第二种声明方式
// // type Callback<T> = (item: T) => void;
// // 定义callback遍历方法 两种方式 应该采用哪一种？

// type Callback = <T>(item: T) => void;

// const forEach = <T>(arr: T[], callback: Callback) => {
//   for (let i = 0; i < arr.length - 1; i++) {
//     // 这里调用callback时，ts并不会执行我们的代码。
//     // 换句话说：它并不清楚arr[i]是什么类型
//     callback(arr[i]);
//   }
// };

// // 所以这里我们并不清楚 callback 定义中的T是什么类型，自然它的类型还是T
// forEach(['1', 2, 3, '4'], <T>(item: T) => {});

// interface IHasLength {
//   length: number;
// }

// // 利用 extends 关键字在声明泛型时约束泛型需要满足的条件
// function getLength<T extends IHasLength>(arg: T) {
//   // throw error: arr上不存在length属性
//   return arg.length;
// }

// getLength([1, 2, 3]); // correct
// getLength('123'); // correct
// getLength({ name: '19Qingfeng', length: 100 }); // correct
// // error 当传入true时，TS会进行自动类型推导 相当于 getLength<boolean>(true)
// // 显然 boolean 类型上并不存在拥有 length 属性的约束，所以TS会提示语法错误
// getLength(true);

// interface IProps {
//   name: string;
//   age: number;
//   sex: string;
// }

// // Keys 类型为 string | number | symbol 组成的联合类型
// type Keys = keyof any;

// // function getValueFromKey(obj: object, key: string) {
// //   // throw error
// //   // key的值为string代表它仅仅只被规定为字符串
// //   // TS无法确定obj中是否存在对应的key
// //   return obj[key];
// // }

// // 函数接受两个泛型参数
// // T 代表object的类型，同时T需要满足约束是一个对象
// // K 代表第二个参数K的类型，同时K需要满足约束keyof T （keyof T 代表object中所有key组成的联合类型）
// // 自然，我们在函数内部访问obj[key]就不会提示错误了
// function getValueFromKey<T extends object, K extends keyof T>(obj: T, key: K) {
//   return obj[key];
// }

// type isString<T> = T extends string ? true : false;

// // a 的类型为 true
// let a: isString<'a'>

// // b 的类型为 false
// let b: isString<1>;

// // 此时的T并不是一个单独的”裸类型“T 而是 [T]
// type GetSomeType<T extends string | number | [string]> = [T] extends string[]
//   ? 'a'
//   : 'b';

// // 即使我们修改了对应的类型判断，仍然不会产生所谓的分发效果。因为[T]并不是一个裸类型
// // 只会产生一次判断  [string] | number extends string[]  ? 'a' : 'b'
// // someTypeThree 仍然只有 'b' 类型 ，如果进行了分发的话那么应该是 'a' | 'b'
// let someTypeThree: GetSomeType<[string] | number>;

// type TypeA = string | number | boolean | symbol;

// type MyExclude<T, K> = T extends K ? never : T;

// // ExcludeSymbolType 类型为 string | number | boolean，排除了symbol类型
// type ExcludeSymbolType = MyExclude<TypeA, symbol | boolean>;

// interface IProps {
//   name: string;
//   age: number;
//   highSchool: string;
//   university: string;
// }

// IPropsKey类型为
// type IPropsKey = {
//  name: boolean;
//  age: boolean;
//  highSchool: boolean;
//  university: boolean;
//  }
// type IPropsKey = { [K in keyof IProps]: boolean };

// interface IInfo {
//   name: string;
//   age: number;
//   school: {
//     middleSchool: string;
//     highSchool: string;
//     university: string;
//   };
// }

// // 其实实现很简单，首先我们在构造新的类型value时
// // 利用 extends 条件判断新的类型value是否为 object
// // 如果是 -> 那么我仍然利用 deepPartial<T[K]> 进行包裹递归可选处理
// // 如果不是 -> 普通类型直接返回即可
// type deepPartial<T> = {
//   [K in keyof T]?: T[K] extends object ? deepPartial<T[K]> : T[K];
// };

// type OptionalInfo = deepPartial<IInfo>;

// let value: OptionalInfo = {
//   name: '1',
//   school: {
//     middleSchool:'xian'
// //   },
// // };

// let a!: { a: string; b: number };
// let b!: { a: string };

// b = a;

// let fn1!: (a: string, b: number) => void;
// let fn2!: (a: string, b: number, c: boolean) => void;

// fn2 = fn1; // TS Error: 不能将fn2的类型赋值给fn1

// class Parent {}

// // Son继承了Parent 并且比parent多了一个实例属性 name
// class Son extends Parent {
//   public name: string = '19Qingfeng';
// }

// // GrandSon继承了Son 在Son的基础上额外多了一个age属性
// class Grandson extends Son {
//   public age: number = 3;
// }

// // 分别创建父子实例
// const son = new Son();

// function someThing(cb: (param: Son) => any) {
//   // do some someThing
//   // 注意：这里调用函数的时候传入的实参是Son
//   cb(Son);
// }

// someThing((param: Grandson) => param); // error
// someThing((param: Parent) => param); // correct

let fn1!: (a: string, b: number) => string;
let fn2!: (a: string, b: number) => string | number | boolean;

fn2 = fn1; // correct
fn1 = fn2; // error: 不可以将 string|number|boolean 赋给 string 类型

let fn3!: (a: string, b: number) => { name: string };
let fn4!: (a: string, b: number) => { name: string; age: number };

fn3 = fn4; // correct
fn4 = fn3; // error: 不可以将 { name: string }; 类型 赋给 { name: string; age: number }; 类型（少的给多的 不安全）

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

//  [string, number] extends Array<infer Item> ? Item : Type;

type subType = Flatten<[string, number]>;

// 定义函数类型
interface IFn {
  (age: number, name: string): void;
}

// type CustomParameters<T> = T extends (...args: infer R) => any ? R : never;

// type FnParameters = [age: number, name: string]
// type FnParameters = CustomParameters<IFn>;

// let a: FnParameters = [25, '19Qingfeng'];

type MyParameters<T extends (...args: any) => any> = T extends (
  ...args: infer R
) => any
  ? R
  : never;

type ArrToUnion<T extends any[]> = T extends Array<infer R> ? R : never;

type C = ArrToUnion<[1, 'string', true]>;

function isNumber(arg: any): arg is number {
  return typeof arg === 'number';
}

function getTypeByVal(val: any) {
  if (isNumber(val)) {
    // 此时由于isNumber函数返回值根据类型谓词的保护
    // 所以可以断定如果 isNumber 返回true 那么传入的参数 val 一定是 number 类型
    val.toFixed();
  }
}

let ooo: unknown;
let numberO: number = 1; // 声明一个number类型的值

let cccc!: number;

// 将number类型的值赋给 ooo 变量 -> Ok
// ooo = numberO;

ooo = cccc;
