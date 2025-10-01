import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  className = '',
  inputClassName = '',
  labelClassName = '',
  required = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}) => {
  const inputId = `input-${name}`;
  const hasError = !!error;

  const inputClasses = [
    'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
    'px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'transition duration-200',
    hasError
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'focus:ring-primary-500 focus:border-primary-500',
    disabled && 'opacity-60 cursor-not-allowed',
    fullWidth ? 'w-full' : '',
    startIcon ? 'pl-10' : 'pl-4',
    endIcon ? 'pr-10' : 'pr-4',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(startIcon, {
              className: 'h-5 w-5 text-gray-400',
            })}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...props}
        />

        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {React.cloneElement(endIcon, {
              className: 'h-5 w-5 text-gray-400',
            })}
          </div>
        )}
      </div>

      {hasError ? (
        <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400" id={`${inputId}-error`}>
          <FiAlertCircle className="flex-shrink-0 mr-1.5 h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default InputField;
