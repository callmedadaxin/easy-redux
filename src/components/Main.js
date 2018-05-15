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
    'addDoubleNum'
  ])
)
class AppComponent extends React.Component {
  addDouble () {
    this.props.addDoubleNum(1)
  }
  render() {
    const { list: listData, count } = this.props
    return (
      <div className="index">
        <span>count: {count}</span>
        <button onClick={this.addDouble.bind(this)}>add</button>
        <ul>
          {
            listData.list.map(item => (<li>{item}</li>))
          }
        </ul>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
