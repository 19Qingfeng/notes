function bindActionCreators(actionCreators, dispatch) {
  // 如果传入的是函数
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  // 保证传入的除了函数以外只能是一个Object
  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function`)
  }

  // 定义最终返回的对象
  const boundActionCreators = {}

  // 迭代actionCreators对象
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    // 如果value是函数，那么为boundActionCreators[key]赋值
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
}

function bindActionCreator(
  actionCreator,
  dispatch
) {
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}

export default bindActionCreators