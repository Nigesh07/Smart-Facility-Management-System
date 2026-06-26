import React, { useEffect, useState } from 'react';
import {
  ClipboardDocumentListIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../../components/dashboard/StatCard';
import TicketTable from '../../components/tickets/TicketTable';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import { TICKET_STATUS } from '../../utils/constants';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ticketService.getAllTickets(), userService.getAllUsers()])
      .then(([t, u]) => {
        setTickets(t);
        setUsers(u);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage label="Loading dashboard…" />;

  const openCount = tickets.filter((t) => t.status !== TICKET_STATUS.CLOSED).length;
  const inProgressCount = tickets.filter((t) => t.status === TICKET_STATUS.IN_PROGRESS).length;
  const closedCount = tickets.filter((t) => t.status === TICKET_STATUS.CLOSED).length;
  const recent = tickets.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-text-secondary">System-wide overview of facility operations.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Open tickets" value={openCount} icon={ClipboardDocumentListIcon} accent="brand" />
        <StatCard label="In progress" value={inProgressCount} icon={ClockIcon} accent="progress" />
        <StatCard label="Closed" value={closedCount} icon={CheckCircleIcon} accent="completed" />
        <StatCard label="Total users" value={users.length} icon={UsersIcon} accent="assigned" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold text-text-primary">Recent tickets</h2>
        <TicketTable
          tickets={recent}
          basePath="/admin/tickets"
          extraColumns={[{ header: 'Reported by', render: (t) => t.createdByName }]}
        />
      </div>
    </div>
  );
}
