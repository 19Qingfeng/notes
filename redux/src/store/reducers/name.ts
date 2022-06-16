import { Reducer } from "redux"

interface NameReducerState {
  name: string
}

interface NameReducerAction {
  type: typeof CHANGE_NAME;
  [payload: string]: string;
}

const initialState = {
  name: ''
}

const CHANGE_NAME = 'change'
export const changeAction = (payload: string) => ({ type: CHANGE_NAME, payload })

const name: Reducer<NameReducerState, NameReducerAction> = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NAME:
      return { name: action.payload }
    default:
      return state
  }
}

export default name