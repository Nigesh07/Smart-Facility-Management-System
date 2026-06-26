
export default function Loader({ label = 'Loading…', fullPage = false, size = 'md' }) {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 text-text-secondary">
      <span
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-border border-t-brand`}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="flex h-full min-h-[40vh] w-full items-center justify-center">{spinner}</div>;
  }

  return spinner;
}
