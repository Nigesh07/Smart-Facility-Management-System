import React, { useEffect, useState } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../../components/dashboard/StatCard';
import TicketTable from '../../components/tickets/TicketTable';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { TICKET_STATUS } from '../../utils/constants';

export default function CoordinatorDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .getCoordinatorTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage label="Loading dashboard…" />;

  const pendingCount = tickets.filter((t) => t.status === TICKET_STATUS.PENDING).length;
  const inProgressCount = tickets.filter((t) => t.status === TICKET_STATUS.IN_PROGRESS).length;
  const completedCount = tickets.filter((t) => t.status === TICKET_STATUS.COMPLETED).length;
  const pendingTickets = tickets.filter((t) => t.status === TICKET_STATUS.PENDING).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-text-secondary">Tickets awaiting assignment or your verification.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Unassigned" value={pendingCount} icon={UserPlusIcon} accent="pending" />
        <StatCard label="In progress" value={inProgressCount} icon={ClockIcon} accent="progress" />
        <StatCard label="Awaiting verification" value={completedCount} icon={CheckCircleIcon} accent="completed" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold text-text-primary">Pending assignment</h2>
        <TicketTable
          tickets={pendingTickets}
          basePath="/coordinator/tickets"
          extraColumns={[{ header: 'Reported by', render: (t) => t.createdByName }]}
        />
      </div>
    </div>
  );
}
