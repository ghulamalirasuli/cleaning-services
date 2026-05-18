import { forwardRef } from 'react';

const variants = {
  primary: 'bg-sage text-white hover:bg-sage-dark focus:ring-sage',
  secondary: 'bg-charcoal text-white hover:bg-charcoal-light focus:ring-charcoal',
  outline:
    'border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white focus:ring-charcoal dark:border-cream/80 dark:text-cream dark:hover:bg-cream dark:hover:text-charcoal',
  ghost: 'text-charcoal hover:bg-cream-dark focus:ring-charcoal',
  gold: 'bg-gold text-white hover:bg-gold-dark focus:ring-gold',
  muted:
    'border border-gray-200 bg-white text-charcoal shadow-sm hover:border-gray-300 hover:bg-gray-50 focus:ring-sage dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-700',
  dangerOutline:
    'border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  loading = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center font-body font-medium rounded-lg
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
