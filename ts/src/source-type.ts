// 获取函数参数类型
type CustomParameters<T extends Function> = T extends (...params: infer R) => unknown ? R : never

// 返回值类型
type CustomReturnType<T extends Function> = T extends (...params: any[]) => infer R ? R : never


function b(a: number) { return 1 }
type BFn = typeof b
type B = CustomReturnType<BFn>

type Params = CustomParameters<typeof b>


let a: number = 1
let c: any = a

let d: unknown = a