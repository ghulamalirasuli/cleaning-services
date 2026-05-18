const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse bg-gray-200 rounded';
  const variants = {
    rect: '',
    circle: '!rounded-full',
    text: 'h-4',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
};

export default Skeleton;
