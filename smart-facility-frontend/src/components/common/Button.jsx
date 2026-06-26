
const VARIANT_CLASSES = {
  primary: 'bg-brand text-white hover:bg-brand-hover shadow-soft',
  secondary: 'bg-card-alt text-text-primary border border-border hover:bg-border/40',
  danger: 'bg-status-critical text-white hover:opacity-90',
  ghost: 'bg-transparent text-text-primary hover:bg-card-alt',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
