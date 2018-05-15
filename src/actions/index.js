export const addDoubleNum = num => dispatch => {
  dispatch('/counts/count/add', num * 2)
  dispatch('/list/addItem', num * 2)
}
