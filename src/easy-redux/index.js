export const centralRequest = {
  fn: fetch,
  handleResponse: res => res.json,
  handleError: error => error
}

export { connect, createStore, hotReload } from './connect'
export { initReducers, combinceReducer } from './reducer'

export const setCentralRequest = (fn, handleResponse, handleError) => {
  Object.assign(centralRequest, {
    fn,
    handleResponse,
    handleError
  })
}