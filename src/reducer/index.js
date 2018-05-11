import { combinceReducer } from '../easy-redux'
const count = {
  state: 1,
  reducers: {
    add: state => state + 1
  }
}

export default combinceReducer({
  count
}, '/')
