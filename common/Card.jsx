import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
