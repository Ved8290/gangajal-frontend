import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './translations/i18n';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/shop.css';
import './styles/admin.css';
import './styles/print.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ToastProvider><SettingsProvider><CartProvider><AuthProvider><App /></AuthProvider></CartProvider></SettingsProvider></ToastProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
