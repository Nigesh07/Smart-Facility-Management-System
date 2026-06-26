import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../../components/dashboard/StatCard';
import TicketTable from '../../components/tickets/TicketTable';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { TICKET_STATUS } from '../../utils/constants';

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    ticketService
      .getMyTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage label="Loading your dashboard…" />;

  const openCount = tickets.filter((t) => t.status !== TICKET_STATUS.CLOSED).length;
  const inProgressCount = tickets.filter((t) => t.status === TICKET_STATUS.IN_PROGRESS).length;
  const closedCount = tickets.filter((t) => t.status === TICKET_STATUS.CLOSED).length;
  const recent = tickets.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary">A quick look at the issues you've reported.</p>
        <Button icon={PlusCircleIcon} onClick={() => navigate('/user/tickets/new')}>
          Create ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open tickets" value={openCount} icon={ClipboardDocumentListIcon} accent="brand" />
        <StatCard label="In progress" value={inProgressCount} icon={ClockIcon} accent="progress" />
        <StatCard label="Closed" value={closedCount} icon={CheckCircleIcon} accent="closed" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold text-text-primary">Recent tickets</h2>
        <TicketTable tickets={recent} basePath="/user/tickets" />
      </div>
    </div>
  );
}
