import { combineReducers as reduxCombinceReducer } from 'redux'
import Namespace from './spaceStore'
import { isObj } from './util'

const getFetchRuducers = inititalState => (reducers, fetch) => {
  const FETCH_SUCCESS = `${fetch}Success`
  const FETCH_FAILED = `${fetch}Failed`

  if (!isObj(inititalState)) {
    throw ('对于fetch类型reducer, state必须是一个对象！')
  }
  // 自动注入loading, error状态，并进行处理
  return {
    ...reducers,
    [fetch]: (state, payload) => {
      const ret = {
        ...state,
        loading: true,
        error: false
      }
      return reducers[fetch] ? reducers[fetch](ret, payload) : ret
    },
    [FETCH_SUCCESS]: (state, payload) => {
      const ret = {
        ...state,
        loading: false
      }
      return reducers[FETCH_SUCCESS] ? reducers[FETCH_SUCCESS](ret, payload) : ret
    },
    [FETCH_FAILED]: (state, error) => {
      const ret = {
        ...state,
        loading: false,
        error: error
      }
      return reducers[FETCH_FAILED] ? reducers[FETCH_FAILED](ret, error) : ret
    }
  }
}
/**
 * 处理支持异步的reducer, 根据fetch字段进行处理
 * 自动添加loading,error状态
 * 并针对fetch,fetchSuccess,fetchFailed进行更改
 */
const handleFetchReducers = (reducersConfig) => {
  if (!reducersConfig.fetch) return reducersConfig

  const { state: inititalState, reducers, fetch } = reducersConfig
  let retReducers = {}

  if (Array.isArray(fetch)) {
    retReducers = fetch.reduce(getFetchRuducers(inititalState), reducers)
  } else {
    retReducers = getFetchRuducers(inititalState)(reducers, fetch)
  }

  return {
    state: {
      ...inititalState,
      loading: false,
      error: false
    },
    reducers: retReducers
  }
}

/**
 * 转换reducer, 并在namespaces中添加
 * @param {Object} reducersConfig 新格式的reducer
 * @param {String} namespace reducer对应的namespace
 */
export const initReducers = (reducersConfig, namespace) => {
  // 优先添加fetch处理
  const config = handleFetchReducers(reducersConfig)
  const { state: inititalState, reducers } = config

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
    // 异步请求action处理

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