import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import POS from "./pos";
import AuthenticationAndRegister from './login';
//import Registration from './registration';
//import SellViewport from "./SellViewport";
//import CustomerView from "./customers";
//import ProductEdition from './productedition';
//import UsersView from './users';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthenticationAndRegister />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
