export const splitObject = (obj, keys) => {
  let ret = {}
  keys.forEach(key => {
    ret[key] = obj[key]
  })
  return ret
}
export const isObj = obj => String(obj) === '[object Object]'