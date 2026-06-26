
export default function StatCard({ label, value, icon: Icon, accent = 'brand' }) {
  const accentClasses = {
    brand: 'bg-brand-soft text-brand',
    pending: 'bg-status-pending-soft text-status-pending',
    assigned: 'bg-status-assigned-soft text-status-assigned',
    progress: 'bg-status-progress-soft text-status-progress',
    completed: 'bg-status-completed-soft text-status-completed',
    closed: 'bg-status-closed-soft text-status-closed',
  };

  return (
    <div className="flex items-center gap-4 rounded-xl2 border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${accentClasses[accent]}`}>
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-display font-bold text-text-primary leading-tight">{value}</span>
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
    </div>
  );
}
