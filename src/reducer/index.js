import { combinceReducer } from '../easy-redux'

const count = {
  state: 1,
  reducers: {
    add: (state, payload) => state + payload
  }
}

const count2 = {
  state: 1,
  reducers: {
    add: state => state + 1
  }
}
const counts = combinceReducer({
  count,
  count2
})

const list = {
  state: {
    list: []
  },
  reducers: {
    addItem (state, item) {
      const list = state.list.slice(0)
      list.push(item)
      return {
        ...state,
        list
      }
    }
  }
}

export default combinceReducer({
  counts,
  list
}, '/')
