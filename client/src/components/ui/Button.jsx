import React from 'react';
import { ButtonSpinner } from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-700',
    link: 'text-primary-600 hover:text-primary-800 underline-offset-4 hover:underline focus:ring-0 p-0 h-auto dark:text-primary-400 dark:hover:text-primary-300',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:px-4 sm:py-2',
    lg: 'px-4 py-2 text-base sm:px-6 sm:py-3',
    xl: 'px-5 py-2.5 text-base sm:px-8 sm:py-4 sm:text-lg',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-4 w-4 sm:h-5 sm:w-5',
    xl: 'h-5 w-5 sm:h-6 sm:w-6',
  };

  const buttonClasses = [
    baseStyles,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2">
          <ButtonSpinner size={size} />
        </span>
      )}
      {!isLoading && startIcon && (
        <span className={`mr-2 ${iconSizes[size] || iconSizes.md}`}>
          {startIcon}
        </span>
      )}
      {children}
      {!isLoading && endIcon && (
        <span className={`ml-2 ${iconSizes[size] || iconSizes.md}`}>
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
