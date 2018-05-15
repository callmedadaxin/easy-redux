import Namespace from './spaceStore'
/**
 * action转化
 * 格式 count => dispatch => dispatch('/count/add', count)
 * 或者 params => dispatch => { dispatch('/count/add', 1), dispatch('/count/sub', 2) }
 * 目标格式, 将对应函数中每个dispatch的格式都进行转化
 * count => ({ type: 'count_add', payload: count })
 */
const initAction = action => params => (dispatch, getstate) => {
  const retDispatch = (namespace, payload) => {
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
