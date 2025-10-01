import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster, useToaster } from './components/ui/Toaster';
import './index.css';

// Composant racine avec Toaster
const Root = () => {
  const { toasts, removeToast } = useToaster();
  
  // Effet pour nettoyer les toasts lors du démontage
  useEffect(() => {
    return () => {
      toasts.forEach((toast) => clearTimeout(toast.timerId));
    };
  }, [toasts]);

  return (
    <>
      <App />
      <Toaster toasts={toasts} removeToast={removeToast} />
    </>
  );
};

const AppWithProviders = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
