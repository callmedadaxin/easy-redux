# Easy-redux
simplify redux api

## Why


## Usage

### Reducer
enhanced combinceReducer which can be combince the new type of reducer

``` js
import { combinceReducer } from 'easy-redux'

const count = {
  state: 0,
  reducers: {
    add: (state, payload) => state + payload,
    sub: (state, payload) => state - payload
  }
}

const other = {
  ...
}

export default combinceReducer({
  count,
  other
}, '/testData')
```

### Actions

``` js
export const addDoubleNumber = (dispatch, num) => {
  dispatch('/testData/add', num * 2)
}
```

### Container

``` js
import { connect } from 'easy-redux'
import * as actions from 'actions'

@connect(
  // pick the states you want
  (state, mapStates) => mapState(state.testData, [
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
