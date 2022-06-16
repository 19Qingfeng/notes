import { Reducer } from "redux";



interface CounterState {
  number: number;
}


const ADD = 'ADD'
const MINUS = 'minus'
export const addAction = (payload: number) => ({ type: ADD, payload })
export const minusAction = (payload: number) => ({ type: MINUS, payload })


const initialState = {
  number: 100
}

const counter: Reducer<CounterState, any> = (state = initialState, action) => {
  const type = action.type
  switch (type) {
    case ADD:
      return { number: state.number + action.payload };
    case MINUS:
      return { number: state.number - action.payload }
    default:
      return state;
  }
}

export default counter