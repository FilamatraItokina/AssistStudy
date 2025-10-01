import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const TOAST_TYPES = {
  success: {
    icon: <FiCheckCircle className="w-5 h-5" />,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  error: {
    icon: <FiAlertCircle className="w-5 h-5" />,
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  info: {
    icon: <FiInfo className="w-5 h-5" />,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  warning: {
    icon: <FiAlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
};

const Toast = ({ message, type = 'info', onDismiss, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const toastStyle = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300); // Attendre la fin de l'animation
  };

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center w-full max-w-sm p-4 mb-4 rounded-lg border ${toastStyle.bgColor} ${toastStyle.textColor} ${toastStyle.borderColor} shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {toastStyle.icon}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 inline-flex h-8 w-8 items-center justify-center"
        onClick={handleDismiss}
        aria-label="Fermer"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Toaster = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 w-80 sm:w-96">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export const useToaster = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, options = {}) => {
    const id = Date.now().toString();
    const { type = 'info', duration = 5000 } = options;

    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, duration },
    ]);

    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

export const toast = {
  success: (message, options) => {
    const { showToast } = useToaster();
    return showToast(message, { ...options, type: 'success' });
  },
  error: (message, options) => {
    const { showToast } = useToaster();
    return showToast(message, { ...options, type: 'error' });
  },
  info: (message, options) => {
    const { showToast } = useToaster();
    return showToast(message, { ...options, type: 'info' });
  },
  warning: (message, options) => {
    const { showToast } = useToaster();
    return showToast(message, { ...options, type: 'warning' });
  },
};
