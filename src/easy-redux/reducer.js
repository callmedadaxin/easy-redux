import { combineReducers as reduxCombinceReducer } from 'redux'
import Namespace from './spaceStore'

/**
 * 转换reducer, 并在namespaces中添加
 * @param {Object} reducersConfig 新格式的reducer
 * @param {String} namespace reducer对应的namespace
 */
export const initReducers = (reducersConfig, namespace) => {
  const { state: inititalState, reducers } = reducersConfig

  const actionNames = Object.keys(reducers)

  const resultActions = actionNames.map(action => {
    const childNamespace = `${namespace}/${action}`
    // 将action存入namespace
    Namespace.setActionByNamespace(childNamespace)

    return {
      name: Namespace.toAction(childNamespace),
      fn: reducers[action]
    }
  })

  return (state = inititalState, action) => {
    const actionFn = resultActions.find(cur => cur.name === action.type)
    if (actionFn) {
      return actionFn.fn && actionFn.fn(state, action.payload)
    }
    return state
  }
}

/**
 * 对应于新reducer的combince方法
 * @param {Object} reducers 新格式的reducer序列
 * @param {String} namespace 该reducer对应的action的命名空间
 */
export const combinceReducer = (reducers, namespace) => {
  const reducerMap = {}
  const reducerNames = Object.keys(reducers)

  const getReducerMap = (namespace) => {
    reducerNames.forEach(function (name) {
      const reduce = reducers[name]
      const childNamespace = namespace === '/' ? `/${name}` : `${namespace}/${name}`
      if (typeof reduce === 'function') {
        reducerMap[name] = reduce(childNamespace)
      } else {
        reducerMap[name] = initReducers(reduce, childNamespace)
      }
    })
    return reduxCombinceReducer(reducerMap)
  }
  // 如果是根，则从头开始初始化
  if (namespace) {
    return getReducerMap(namespace)
  }
  return getReducerMap
}