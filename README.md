# Easy-redux
基于redux,react-redux 简化redux api

同时针对异步请求redux进行了优化，类似[react-fetch-middleware](https://github.com/callmedadaxin/react-fetch-middleware)

## 使用
目前并没有发布到NPM，会等到版本稳定运营于生产环境后进行publish, 源码可于src/easy-redux中查看。

### Reducer
去掉繁琐的actions, 将复杂的switch语句进行拆分，简化之前的reducer。

使用增强的combinceReducer来对新的reducer格式进行合并，会在内部自动进行转化，
将每个reducer变为标准的redux格式，并将对应的action以`/namespace/action`的方式进行记录。

``` js
import { combinceReducer, createStore } from 'easy-redux'

const count = {
  state: 0,
  reducers: {
    add: (state, payload) => state + payload,
    sub: (state, payload) => state - payload
  }
}

const list = {
  // 添加fetch字段后，会自动为该reducer注入loading,error字段
  // reducers中会自动包含`${fetch}`、`${fetch}Success`和`${fetch}Failed`方法
  // 并在其中自动进行处理，为loading和error状态赋值
  // 你也可以在其中书写同名函数，在对应状态触发，此时其已包含正确的loading和error状态
  fetch: 'getList', // 多个时，用数组 ['getList','other']
  state: {
    list: []
  },
  reducers: {
    getListSuccess: (state, payload) => ({
      ...state,
      list: payload
    })
  }
}

// 记得将最外层的reducer加上命名空间。
// 对应各个reducer的action会对应到 `/list/getList`
const reducer = combinceReducer({
  count,
  list
}, '/')

export default createStore(reducer, {}, middlewares)
```

### Actions
简化action和action创建函数，避免频繁的import action等。

通过之前设置的命名空间来保重各action的唯一性

``` js
export const addDoubleNumber = num => (dispatch, getState) => dispatch('/count/add', num * 2)
```

#### 异步action
内部引用了redux-thunk, 可直接使用

``` js
export const addDoubleNumber = num => dispatch => {
  setTimeout(() => {
    dispatch('/count/add', num * 2)
  }, 1000)
}
```

#### request
针对之前定义了fetch字段的reducer，可直接dispatch一个action对象,

dispatch后，会自动进行请求并处理，并将整个aciton分为三个action,并在请求过程中自动触发：

action, `${action}/success`, `${action/failed}`

``` js
export const getList = params => dispatch => {
  return dispatch({
    action: '/list/getList',
    url: '/api/getList',
    params,
    handleResult: res => res.data.list,
    handleError: error => error,
    requestFn: fetch // 可以针对这个请求设置特殊的请求，默认为centralRequest
  })
}
```

### Container
增强了之前的connect函数，可以直接在对象中择取对于属性

``` js
import { connect } from 'easy-redux'
import * as actions from 'actions'

@connect(
  // pick the states you want
  (state, mapStates) => mapState(state, [
    'count',
    'other'
  ]),
  // pick the actions
  (dispatch, mapActions) => mapActions(actions, [
    'addDoubleNumber'
  ])
)
export default class Counter extends Component {
  ...
}
```

## TOTO
- hot reload
- 优化action处理，转为middleware
- 性能调优
