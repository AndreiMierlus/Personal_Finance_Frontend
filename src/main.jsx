import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { Provider } from 'react-redux';
import {  store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <ThemeProvider>
          <App />
        </ThemeProvider>
      {/* </PersistGate> */}
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
