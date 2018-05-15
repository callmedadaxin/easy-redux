export const addDoubleNum = num => {
  return dispatch => {
    dispatch('/counts/count/add', num * 2)
  }
}