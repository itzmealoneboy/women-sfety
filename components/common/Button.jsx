import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  loading = false, 
  ...props 
}) => {
  const baseStyle = "flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
  };

  return (
    <button 
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
