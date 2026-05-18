const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-200 p-6
        dark:bg-gray-900 dark:border-gray-700
        ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
