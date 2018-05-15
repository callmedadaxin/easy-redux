import { connect as reduxConnect } from 'react-redux'
import { bindActionCreators, createStore as reduxCreateStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { splitAndInitActions } from './action'
import { combinceReducer } from './reducer'
import { splitObject } from './util'

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

/**
 * 增强的createStore函数，用于初始化根部的reducer
 * 若子reducer全部用新的combinceReducer初始化过，则可直接引用远createStore
 * @param {Object || Function} appReducer 根reducer
 * @param {Object} inititalState 初始化状态
 * @param {Array} middlewares 中间件
 */
export const createStore = (appReducer, inititalState, middlewares = []) => {
  const retMiddlewares = [thunk, ...middlewares]

  if (typeof appReducer !== 'function') {
    appReducer = combinceReducer(appReducer, '/')
  }

  return reduxCreateStore(appReducer, inititalState, applyMiddleware(...retMiddlewares))
}