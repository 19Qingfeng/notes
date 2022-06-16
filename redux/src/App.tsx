import React from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import store from './store';
import FirstPage from './pages/index';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <FirstPage></FirstPage>
    </Provider>
  );
};

export default App;
