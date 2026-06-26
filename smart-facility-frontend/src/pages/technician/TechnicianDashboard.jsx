import React, { useEffect, useState } from 'react';
import { ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import StatCard from '../../components/dashboard/StatCard';
import TicketTable from '../../components/tickets/TicketTable';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { TICKET_STATUS } from '../../utils/constants';

export default function TechnicianDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .getAssignedTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage label="Loading dashboard…" />;

  const assignedCount = tickets.filter((t) => t.status === TICKET_STATUS.ASSIGNED).length;
  const inProgressCount = tickets.filter((t) => t.status === TICKET_STATUS.IN_PROGRESS).length;
  const completedCount = tickets.filter((t) => t.status === TICKET_STATUS.COMPLETED || t.status === TICKET_STATUS.CLOSED).length;
  const activeTickets = tickets
    .filter((t) => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-text-secondary">Your assigned facility issues.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Awaiting start" value={assignedCount} icon={ClipboardDocumentListIcon} accent="assigned" />
        <StatCard label="In progress" value={inProgressCount} icon={ClockIcon} accent="progress" />
        <StatCard label="Completed" value={completedCount} icon={CheckCircleIcon} accent="completed" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold text-text-primary">Active work</h2>
        <TicketTable tickets={activeTickets} basePath="/technician/tickets" />
      </div>
    </div>
  );
}
