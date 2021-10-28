import React from 'react';
import ReactDOM from 'react-dom';
import './../src/styles/index.css';
import MainPage from '../src/pages/MainPage';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
