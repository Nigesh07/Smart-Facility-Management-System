import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const TITLES = [
  { match: /\/user\/dashboard$/, title: 'Dashboard' },
  { match: /\/user\/tickets\/new$/, title: 'Create Ticket' },
  { match: /\/user\/tickets$/, title: 'My Tickets' },
  { match: /\/user\/tickets\/\d+$/, title: 'Ticket Details' },

  { match: /\/coordinator\/dashboard$/, title: 'Dashboard' },
  { match: /\/coordinator\/tickets$/, title: 'Manage Tickets' },
  { match: /\/coordinator\/tickets\/\d+$/, title: 'Ticket Details' },

  { match: /\/technician\/dashboard$/, title: 'Dashboard' },
  { match: /\/technician\/tickets$/, title: 'Assigned Tickets' },
  { match: /\/technician\/tickets\/\d+$/, title: 'Ticket Details' },

  { match: /\/admin\/dashboard$/, title: 'Dashboard' },
  { match: /\/admin\/users$/, title: 'Manage Users' },
  { match: /\/admin\/categories$/, title: 'Manage Categories' },
  { match: /\/admin\/tickets$/, title: 'All Tickets' },

  { match: /\/profile$/, title: 'Profile' },
];

function deriveTitle(pathname) {
  const found = TITLES.find((t) => t.match.test(pathname));
  return found ? found.title : 'Smart Facility';
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = deriveTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile slide-out sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full w-72 max-w-[85vw]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
