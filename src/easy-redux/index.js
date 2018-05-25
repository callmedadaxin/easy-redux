import { centralRequest } from './request.js'

export { connect, createStore, hotReload } from './connect'
export { initReducers, combinceReducer } from './reducer'

export const setCentralRequest = (fn, handleResponse, handleError) => {
  centralRequest.set(fn, handleResponse, handleError)
}