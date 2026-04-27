import React from 'react'

const Card = ({ children, className = '', onClick, hoverable = false }) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-md ${
        hoverable ? 'hover:shadow-lg transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
