import { createStore } from '../easy-redux'

const middlewares = []

export default function (reducer, initialState = {}) {
  return createStore(reducer, initialState, middlewares)
}