import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options = [], placeholder, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="form-label">{label}</label>}
      <select
        ref={ref}
        className={`
          form-control appearance-none
          disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed
          dark:disabled:bg-gray-800 dark:disabled:text-gray-400
          ${error ? 'form-control-error' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400 dark:text-red-400">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
