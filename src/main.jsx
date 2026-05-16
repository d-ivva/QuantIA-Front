import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './auth/AuthProvider';
import ToastContainer from './components/ui/ToastContainer';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
