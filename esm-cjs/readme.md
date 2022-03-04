ESM 和 CSJ 的区别：

- ESM 中顶层导入语句`this`指向`undefined`，而`CJS`中顶层`this`指向的是本模块运行到当前`this`语句的`exports`值。

* 导入导出语法不同，`ESM`使用`import/export`，而`CJS`使用`exports/require`。

* `ESM`无法在条件语句中使用。（不包裹动态引用 `dynamic import`）

* `ESM`是静态编译期间就确定的模块依赖。所以 `Tree Shaking`仅仅存在`ESM`中。

* `CJS`导出的是值的拷贝，会对加载结果进行缓存，模块内部在修改导出的值的话并不会同步到外部。而`ESM`导出的是值的引用（导出的是变量），**内部修改**可以同步到外部。

* 编译阶段`ESM`引入存在模块变量提升，所有`import`会被提升到顶部。`CJS`并不会存在模块提升。

* 同样`CJS`当存在`module.exports`和`exports`时，仅仅只有`module.exports`生效（本质上是`CJS`将每个模块使用`vm.runThisContext`当作函数去执行(`module`和`exports`都是参数)），而`ESM`可以配合`export default`和`export`一起使用，甚至可以使用`import * as value from 'xxx'`在同一变量中来使用两种方式。

TODO: 详细梳理原理，异步/同步原理实现。
