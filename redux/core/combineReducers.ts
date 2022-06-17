
/**
 * combineReducers 接受一个 reducers 结合的对象
 * @param reducers 传入的 reducers 是一个 Object 类型,同时 Object 中 key 为对应的 reducer 名称，value 为对应的 reducer
 * @returns 返回combination函数 它是一个组合而来的reducer函数
 */
function combineReducers(reducers) {

  // 获得 reducers 所有 key 组成的列表
  const finalReducers = Object.keys(reducers)

  return function combination(state, action) {
    // 定义hasChanged变量表示本次派发action是否修改了state
    let hasChanged = false

    // 定义本次reducer执行 返回的整体store
    const nextState = {}

    // 迭代reducers中的每个reducer
    for (let key of finalReducers) {
      // 获得reducers中当前的reducer
      const reducer = finalReducers[key]
      // 获取当前reducers中对应的state
      const previousStateForKey = state[key]
      // 执行 reducer 传入旧的 state 以及 action 获得执行后的 state
      const nextStateForKey = reducer(previousStateForKey, action)
      // 更新
      nextState[key] = nextStateForKey
      // 判断是否改变 如果该reducer中返回了全新的state 那么重制hasChanged状态为true
      hasChanged = hasChanged || nextStateForKey === previousStateForKey
    }

    // 同时最后在根据 finalReducers 的长度进行一次判断(是否有新增reducer执行为state添加了新的key&value)
    hasChanged =
      hasChanged || finalReducers.length !== Object.keys(state).length

    // 通过 hasChanged 标记位 判断是否改变并且返回对应的state
    return hasChanged ? nextState : state
  }
}

export default combineReducers