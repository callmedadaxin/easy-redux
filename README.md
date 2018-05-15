# Easy-redux
simplify redux api

## Usage

### Reducer
enhanced combinceReducer which can combince the new type of reducer

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
  // the state will contains loading, error states automatically
  // and change loading as true when start getting list with dispatching `/list/${fetch}
  // change loading as false when succeed or failed
  // with dispatching `/list/${fetch}Success` and `/list/${fetch}Failed`
  fetch: 'getList',
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

const reducer = combinceReducer({
  count,
  list
}, '/')

export default createStore(reducer, {}, applyMiddleware(...middlewares))
```

### Actions

``` js
export const addDoubleNumber = num => dispatch => {
  dispatch('/count/add', num * 2)
}
```

request

``` js
// it will auto dispatch /list/getListStart /list/getListSuccess /list/getListFailed
// and set loading as true when /list/getListStart,
// and set loading as false when /list/getListSuccess and /list/getListFailed
// and set error as handleError() when /list/getListFailed
export const getList = params => dispatch => {
  return dispatch({
    action: '/list/getList',
    url: '/api/getList',
    params,
    handleResponse: res => res.data.list,
    handleError: error => error,
    fetchMethod: (url, params) => yourOwnMethods(url, params)
  })
}
```

### Container

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
