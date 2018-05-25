import Namespace from './spaceStore'
import { isObj } from './util'
import { centralRequest } from './request'

/**
 * action转化
 * 格式 count => dispatch => dispatch('/count/add', count)
 * 或者 params => dispatch => { dispatch('/count/add', 1), dispatch('/count/sub', 2) }
 * 目标格式, 将对应函数中每个dispatch的格式都进行转化
 * count => ({ type: 'count_add', payload: count })
 */
const initAction = action => params => (dispatch, getstate) => {
  const { fn: request, handleResponse, handleError: handleCentralError } = centralRequest.get()
  const retDispatch = (namespace, payload) => {
    // 处理异步情况
    if (isObj(namespace)) {
      const { url, params, action, handleResult = res => res, handleError = error => error } = namespace
      dispatch({
        type: Namespace.get(action),
        payload: params
      })
      return request(url, params)
        .then(handleResponse)
        .catch(handleCentralError)
        .then(json => {
          const ret = handleResult(json)
          dispatch({
            type: Namespace.get(`${action}Success`),
            payload: ret
          })
          return ret
        })
        .catch(error => {
          const err = handleError(error)
          dispatch({
            type: Namespace.get(`${action}Failed`),
            payload: err
          })
          return err
        })
    }
    return dispatch({
      type: Namespace.get(namespace),
      payload
    })
  }
  return action(params)(retDispatch, getstate)
}
/**
 * 将action拆分转化
 * @param {Object} actions 整个actions对象
 * @param {Array} keys 摘取的action名称
 */
export const splitAndInitActions = (actions, keys) => {
  return keys.reduce((retActions, key) => {
    retActions[key] = initAction(actions[key])
    return retActions
  }, {})
}
