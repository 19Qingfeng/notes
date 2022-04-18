// 获取函数参数类型
type CustomParameters<T extends Function> = T extends (
  ...params: infer R
) => unknown
  ? R
  : never;

// 返回值类型
type CustomReturnType<T extends Function> = T extends (
  ...params: any[]
) => infer R
  ? R
  : never;

function b(a: number) {
  return 1;
}
type BFn = typeof b;
type B = CustomReturnType<BFn>;

type Params = CustomParameters<typeof b>;

let a: number = 1;
let c: any = a;

let d: unknown = a;

// TS 中的分发、循环 总结文章1

type ExcludeType<T, K> = T extends K ? never : T;

const a: string = '1';
a.toString();
type B = Record<number | string, number>;
interface B {
  private a(): void;
}

type A<T> = {
  [key in keyof T]: T[key];
};

type C = Pick<A, 'string'>;
