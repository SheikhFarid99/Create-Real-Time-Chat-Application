import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './main.scss'
import reportWebVitals from './reportWebVitals';

import { Provider } from "react-redux";
import store from './store/index';
import { positions,transitions,Provider as AlertProvider } from "react-alert";
import  alertTemplate from 'react-alert-template-basic'

const options = {
  timeout : 5000,
  positions : positions.BOTTOM_CENTER,
  transitions : transitions.SCALE
}

ReactDOM.render(
  
    <Provider store={store}>
      <AlertProvider template ={alertTemplate} {...options}>
          <App/>
      </AlertProvider>
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
