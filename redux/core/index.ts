function createStore(reducer: Function, initialState: any) {
  // 初始化的state
  let state: any;
  // store订阅的callback
  const listeners: Function[] = []

  // 获取state的值
  function getState() {
    return state;
  }

  // 派发 向store派发一个action
  // 根据老的状态state和新的动作action修改store
  function dispatch(action: { type: string, [key: string]: any }) {
    // 先仅考虑单个的 reducers
    state = reducer(state, action)
    listeners.forEach(l => l)
  }

  // 订阅
  function subscribe(listener: Function) {
    listeners.push(listener)
    // 返回取消该监听的方法
    return () => {
      const index = listeners.findIndex(i => i === listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  // 初始化时派发一次 相当于初始化State
  dispatch({ type: 'initState' })
  return {
    getState,
    subscribe,
    dispatch
  }
}