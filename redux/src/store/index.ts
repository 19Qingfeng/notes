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



function counter(state = { number: 1 }, action) {
  switch (action.type) {
    case 'add':
      return { number: state.number + 1 }
    default:
      return state
  }
}

function name(state = { name: 'wang.haoyu' }, action) {
  switch (action.type) {
    case 'add':
      return { number: '19QIngfeng' }
    default:
      return state
  }
}
const store = createStore(combineReducers({
  name,
  counter
}))

store.dispatch({ type: 'add' })

store.getState()


// 通过actionCreator派发一个action
// store.dispatch(addAction())



export default store