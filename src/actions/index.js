export const addDoubleNum = num => {
  console.log(num)
  return dispatch => {
    console.log(dispatch)
    dispatch('/count/add', num * 2)
  }
}