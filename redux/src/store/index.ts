import { createStore, combineReducers } from 'redux'
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

function reducer(state = { number: 1 }, action) {
  switch (action.type) {
    case 'add':
      return { number: state.number + 1 }
    default:
      return state
  }
}

const store = createStore(reducer)

console.log(store.getState())

export default store