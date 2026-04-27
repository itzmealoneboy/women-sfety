import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, icon, className = '', error, ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full py-2 ${icon ? 'pl-10' : 'pl-3'} pr-3 border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border text-gray-900 placeholder-gray-400 ${
            error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
