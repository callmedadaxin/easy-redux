export default {
  namespaces: {},
  set(key, value) {
    this.namespaces[key] = value
  },
  setActionByNamespace(namespace) {
    const action = this.toAction(namespace)
    this.namespaces[namespace] = action
  },
  get(key) {
    return this.namespaces[key]
  },
  toAction(namespace) {
    let ret = namespace
    if (namespace.indexOf('/') === 0) {
      ret = namespace.slice(1)
    }
    return ret.split('/').join('_')
  }
}