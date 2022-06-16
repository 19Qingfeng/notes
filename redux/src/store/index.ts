import { createStore, combineReducers, bindActionCreators } from 'redux'
// import counter from './reducers/index'
// import name from './reducers/name'

// const store = createStore(combineReducers({
//   counter,
//   name
// }), {
//   counter: {
//     number: 1000
//   },
//   name: {
//     name: 'wang.haoyu'
//   }
// })

// store.subscribe(() => {
//   console.log('store概念')
// })

const ADD = 'ADD'

// 创建一个ActionCreator
const addAction = () => ({ type: ADD })

function reducer(state = { number: 1 }, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 }
    default:
      return state
  }
}

const store = createStore(reducer)


// 通过actionCreator派发一个action
// store.dispatch(addAction())

const action = bindActionCreators({
  add: addAction
}, store.dispatch)

action()

console.log(store.getState(), '获得state')

export default store