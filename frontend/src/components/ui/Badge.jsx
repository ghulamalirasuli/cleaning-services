const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    sage: 'bg-sage-light/30 text-sage-dark',
    gold: 'bg-gold-light/30 text-gold-dark',
    success: 'bg-green-100 text-green-500',
    warning: 'bg-gold-light text-gold-dark',
    error: 'bg-red-100 text-red-500',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
