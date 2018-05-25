export const centralRequest = {
  fn: fetch,
  handleResponse: res => res.json,
  handleError: error => error,
  set(fn, handleResponse, handleError) {
    fn && (this.fn = fn)
    handleResponse && (this.handleResponse = handleResponse)
    handleError && (this.handleError = handleError)
  },
  get() {
    return {
      fn: this.fn,
      handleResponse: this.handleResponse,
      handleError: this.handleError
    }
  }
}