require('normalize.css/normalize.css');
import React from 'react';
import { connect } from '../easy-redux'
import * as actions from '../actions'

@connect(
  (state) => ({
    list: state.list,
    count: state.counts.count
  }),
  (dispatch, mapActions) => mapActions(actions, [
    'addDoubleNum',
    'fetchList'
  ])
)
class AppComponent extends React.Component {
  componentWillMount = () => {
    this.props.fetchList()
  }
  
  addDouble () {
    this.props.addDoubleNum(1)
  }
  render() {
    const { list: listData, count } = this.props
    const { loading, list, error } = listData
    return (
      <div className="index">
        <span>count: {count}</span>
        <button onClick={this.addDouble.bind(this)}>add</button>
        {
          loading
            ? 'loading...'
            : error
              ? String(error)
              : <ul>
                {
                  list.map(item => (<li>{item}</li>))
                }
              </ul>
        }
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
