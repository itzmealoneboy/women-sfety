const PasswordStrength = ({ strength, text }) => {
  const colors = ['#ff4757', '#ff6b81', '#ffa502', '#7bed9f', '#4CAF50']
  
  return (
    <div className="mt-2">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${strength * 20}%`,
            backgroundColor: colors[strength - 1] || '#ff4757'
          }}
        />
      </div>
      <span className="text-xs mt-1 block text-gray-600">{text}</span>
    </div>
  )
}

export default PasswordStrength
