require('normalize.css/normalize.css');
import React from 'react';
import { connect } from '../easy-redux'
import * as actions from '../actions'

@connect(
  state => {
    return state
  },
  (dispatch, mapActions) => mapActions(actions, [
    'addDoubleNum'
  ])
)
class AppComponent extends React.Component {
  addDouble () {
    this.props.addDoubleNum(1)
  }
  render() {
    const { count } = this.props
    return (
      <div className="index">
        <span>count: {count}</span>
        <button onClick={this.addDouble.bind(this)}>add</button>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
