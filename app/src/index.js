import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['EB Garamond', 'sans-serif']
  }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

ReactDOM.render(
  <BrowserRouter>
    <App />  
  </BrowserRouter>,
  document.getElementById('root')
);