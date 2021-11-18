// Baseline requirements
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Themeing
import 'semantic-ui-less/semantic.less'
import 'style/main.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);