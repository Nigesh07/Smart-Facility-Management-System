import { Bars3Icon } from '@heroicons/react/24/outline';
import ThemeToggle from '../common/ThemeToggle';
import NotificationBell from '../common/NotificationBell';

export default function Header({ title, breadcrumb, onMenuClick }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
      <div className="flex min-w-0 flex-col">
        {breadcrumb && <span className="truncate text-xs text-text-secondary">{breadcrumb}</span>}
        <h1 className="truncate font-display text-lg font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <NotificationBell />
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-text-secondary hover:bg-card-alt lg:hidden"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
