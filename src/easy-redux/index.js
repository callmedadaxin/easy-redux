import { connect as reduxConnect } from 'react-redux'
import { bindActionCreators, combineReducers, createStore as reduxCreateStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { splitObject } from './util'

const namespaces = {}

/**
 * 转换reducer, 并在namespaces中添加
 * @param {Function} reducer
 */
const initReducers = (reducersConfig, namespace) => {
  const { state: inititalState, reducers } = reducersConfig
  // action prefix
  // example: test_count
  const actionsPrefix = namespace.slice(1).split('/').join('_')
  const actionNames = Object.keys(reducers)
  // action
  // test_count_add
  const resultActions = actionNames.map(action => {
    return {
      name: `${actionsPrefix}_${action}`,
      fn: reducers[action]
    }
  })

  actionNames.forEach(action => {
    // namespace: test/count/add => test_count_add
    namespaces[`${namespace}/${action}`] = `${actionsPrefix}_${action}`
  })

  return (state = inititalState, action) => {
    const actionFn = resultActions.find(cur => cur.name === action.type)
    if (actionFn) {
      return actionFn.fn && actionFn.fn(state, action.payload)
    }
    return state
  }
}

export const combinceReducer = (reducers, namespace) => {
  const reducerMap = {}
  const reducerNames = Object.keys(reducers)

  const getReducerMap = () => {
    reducerNames.forEach(function (name) {
      const reduce = reducers[name]
      const newNamespace = namespace === '/' ? `/${name}` : `${namespace}/${name}`
      if (typeof reduce === 'function') {
        reducerMap[name] = reduce(newNamespace)
      } else {
        reducerMap[name] = initReducers(reduce, newNamespace)
      }
    })
    return combineReducers(reducerMap)
  }
  // 如果是根，则从头开始初始化
  if (namespace) {
    return getReducerMap()
  }
  return getReducerMap
}
/**
 * 将action拆分转化
 * @param {Object} actions 整个actions对象
 * @param {Array} keys 摘取的action名称
 */
const splitAndInitActions = (actions, keys) => {
  let retAction = {}

  keys.forEach(key => {
    retAction[key] = initAction(actions[key])
  })
  return retAction
}
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
      type: namespaces[namespace],
      payload
    })
  }
  return action(params)(retDispatch, getstate)
}
/**
 * 增强的connect函数
 * @param {Function} fn (state, mapState) => pick(state.a, ['b'])
 * @param {Function} actions actions对象 (dispatch, mapActions) => mapActions(actions, ['addNum'])
 */
export const connect = (fn, actions) => {
  const mapStateToProps = state => fn(state, splitObject)
  const mapDispatchToProps = dispatch => {
    const resultActions = actions(dispatch, splitAndInitActions)
    return bindActionCreators(resultActions, dispatch)
  }
  return reduxConnect(mapStateToProps, mapDispatchToProps)
}

export const createStore = (appReducer, inititalState, middlewares = []) => {
  const retMiddlewares = [thunk, ...middlewares]
  if(typeof appReducer !== 'function') {
    appReducer = initReducers(appReducer, '/')
  }

  return reduxCreateStore(appReducer, inititalState, applyMiddleware(...retMiddlewares))
}