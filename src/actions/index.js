export const addDoubleNum = num => dispatch => {
  dispatch('/counts/count/add', num * 2)
  dispatch('/list/addItem', num * 2)
}

export const fetchList = params => dispatch => {
  dispatch({
    action: '/list/getList',
    url: '/api/getList',
    params,
    handleResponse: res => res.list,
    handleError: error => error,
    fetchMethod: (url, params) => fetch(url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(params)
    })
  })
}