import { forwardRef, useId } from 'react';

const Switch = forwardRef(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      label,
      ariaLabel,
      className = '',
      id: idProp,
    },
    ref
  ) => {
    const uid = useId();
    const id = idProp ?? uid;
    const labelId = label ? `${id}-label` : undefined;

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {label ? (
          <span
            id={labelId}
            className="text-sm font-medium text-gray-600 font-body whitespace-nowrap"
          >
            {label}
          </span>
        ) : null}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelId}
          aria-label={!label && ariaLabel ? ariaLabel : undefined}
          id={id}
          disabled={disabled}
          onClick={() => !disabled && onCheckedChange(!checked)}
          className={`
            relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 ease-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${checked ? 'border-sage bg-sage shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]' : 'border-gray-200 bg-gray-100'}
          `}
        >
          <span
            aria-hidden
            className={`
              pointer-events-none absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md ring-1 ring-black/[0.05]
              transition-transform duration-200 ease-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
