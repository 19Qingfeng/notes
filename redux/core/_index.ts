/**
 * @param obj The object to inspect.
 * @returns True if the argument appears to be a plain object.
 */
function isPlainObject(obj: any) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}




/**
 * 创建Store
 * @param reducer  传入的reducer
 * @param loadedState 初始化的state
 * @returns 
 */
function createStore(reducer, loadedState) {
  // reducer 必须是一个函数
  if (typeof reducer !== 'function') {
    throw new Error(
      `Expected the root reducer to be a function. `
    )
  }

  // 初始化的state
  let currentState = loadedState
  // 初始化的reducer
  let currentReducer = reducer
  // 当前正在执行的listeners
  let currentListeners = []
  // 下一次变更后的listeners
  let nextListeners = currentListeners
  // 是否正在dispatch
  let isDispatching = false

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * 派发action触发reducer
   */
  function dispatch(action) {
    // action 必须是一个纯对象
    if (!isPlainObject(action)) {
      throw new Error(`You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      )
    }

    // action 必须存在一个 type 属性
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      )
    }

    // 如果当前正在dispatching状态 报错
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      // 调用reducer传入的currentState和action
      // reducer的返回值赋给currentState
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // 当reducer执行完毕后 通知订阅的listeners 依次进行执行
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    // dispatch完成返回action
    return action
  }

  /**
   * 订阅store中action的变化
   */
  function subscribe(listener: () => void) {
    // listener 必须是一个函数
    if (typeof listener !== 'function') {
      throw new Error(
        `Expected the listener to be a function. Instead.`
      )
    }
    // 如果当前正在执行 reducer 过程中，不允许进行额外的订阅
    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state. ' +
        'See https://redux.js.org/api/store#subscribelistener for more details.'
      )
    }

    // 标记当前listener已经被订阅了
    let isSubscribed = true

    // 确保listeners正确性
    ensureCanMutateNextListeners()
    // 为下一次的listeners中添加传入的listener
    nextListeners.push(listener)

    // 返回取消订阅的函数
    return function unsubscribe() {
      // 如果当前listener已经被取消（未订阅状态，那么之际返回）
      if (!isSubscribed) {
        return
      }
      // 当前如果是reducer正在执行的过程，取消订阅直接报错
      // 换言之，如果在reducer函数执行中调用取消订阅，那么直接报错
      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. ' +
          'See https://redux.js.org/api/store#subscribelistener for more details.'
        )
      }

      // 标记当前已经取消订阅
      isSubscribed = false

      // 同样确保listeners正确性
      ensureCanMutateNextListeners()
      // 逻辑很简单了利用 indexOf + splice 删除当前订阅的listener
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }

  /**
   * 获取State
   */
  function getState() {
    return currentState
  }

  /**
   * 替换store中的reducer
   * @param reducer 需要替换的reducer
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error(
        `Expected the nextReducer to be a function. Instead, received: '}`
      )
    }

    currentReducer = nextReducer

    dispatch({ type: '@redux/INIT$`' })

    return {
      dispatch,
      replaceReducer,
      getState,
      subscribe
    }
  }

  dispatch({ type: '@redux/INIT$`' })

  return {
    dispatch,
    replaceReducer,
    getState,
    subscribe
  }
}

export default createStore