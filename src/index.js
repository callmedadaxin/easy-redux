import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
import { Provider } from 'react-redux';
import createStore from './stores'
import appReducer from './reducer'

const store = createStore(appReducer)

// Render the main component into the dom
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
