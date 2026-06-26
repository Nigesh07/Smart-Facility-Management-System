import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  TagIcon,
  RectangleStackIcon,
  WrenchScrewdriverIcon,
  BuildingOffice2Icon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const NAV_BY_ROLE = {
  [ROLES.USER]: [
    { to: '/user/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/user/tickets/new', label: 'Create Ticket', icon: PlusCircleIcon },
    { to: '/user/tickets', label: 'My Tickets', icon: ClipboardDocumentListIcon },
  ],
  [ROLES.COORDINATOR]: [
    { to: '/coordinator/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/coordinator/tickets', label: 'Manage Tickets', icon: ClipboardDocumentListIcon },
  ],
  [ROLES.TECHNICIAN]: [
    { to: '/technician/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/technician/tickets', label: 'Assigned Tickets', icon: WrenchScrewdriverIcon },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/admin/users', label: 'Manage Users', icon: UsersIcon },
    { to: '/admin/categories', label: 'Manage Categories', icon: TagIcon },
    { to: '/admin/tickets', label: 'All Tickets', icon: RectangleStackIcon },
  ],
};

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navItems = NAV_BY_ROLE[user?.role] || [];

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <BuildingOffice2Icon className="h-7 w-7 text-brand" />
        <span className="font-display text-base font-bold text-text-primary leading-tight">
          Smart Facility
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-soft text-brand'
                      : 'text-text-secondary hover:bg-card-alt hover:text-text-primary'
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-3">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-card-alt"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
            {getInitials(user?.fullName)}
          </span>
          <span className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-text-primary">{user?.fullName}</span>
            <span className="truncate text-xs text-text-secondary">{user?.role}</span>
          </span>
        </NavLink>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-status-critical transition-colors hover:bg-status-critical-soft"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
