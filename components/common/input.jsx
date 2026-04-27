import React, { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 ${
            error ? 'border-danger' : 'border-gray-200'
          } rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
