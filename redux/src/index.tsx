import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import store from './store';
console.log(store, 'store');

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);

root.render(
  <React.StrictMode>
    {/* <App /> */}
    <div>123</div>
  </React.StrictMode>
);
