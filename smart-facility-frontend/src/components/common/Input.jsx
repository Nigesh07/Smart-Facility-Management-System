
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  name,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-status-critical ml-0.5">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded border bg-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary
          focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1
          disabled:opacity-60 disabled:cursor-not-allowed transition-colors
          ${error ? 'border-status-critical' : 'border-border'}`}
        {...rest}
      />
      {error && <span className="text-xs text-status-critical">{error}</span>}
    </div>
  );
}
