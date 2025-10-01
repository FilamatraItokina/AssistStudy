import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid border-t-primary-500 border-r-primary-500 border-b-transparent border-l-transparent ${
          sizeClasses[size] || sizeClasses.md
        }`}
        style={{
          borderWidth: '0.2em',
          borderTopColor: 'currentColor',
          borderRightColor: 'currentColor',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
        }}
        role="status"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
};

export const PageLoader = ({ message = 'Chargement en cours...' }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex flex-col items-center justify-center z-50">
      <LoadingSpinner size="lg" className="text-primary-600 dark:text-primary-400 mb-4" />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <LoadingSpinner size={size} className="text-current" />
    </div>
  );
};
