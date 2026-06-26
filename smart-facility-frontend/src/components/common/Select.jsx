import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Select({
  label,
  value,
  onChange,
  name,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  allowEmpty = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-status-critical ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full appearance-none rounded-lg border bg-card px-3 py-2 pr-9 text-sm text-text-primary
            focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1
            disabled:opacity-60 disabled:cursor-not-allowed transition-colors
            ${error ? 'border-status-critical' : 'border-border'}`}
        >
          <option value="" disabled={!allowEmpty}>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      </div>
      {error && <span className="text-xs text-status-critical">{error}</span>}
    </div>
  );
}
