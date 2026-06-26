import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import TicketTimeline from '../../components/tickets/TicketTimeline';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { formatDateTime } from '../../utils/formatDate';

export default function AdminTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ticketService.getTicketById(id), ticketService.getTicketHistory(id)])
      .then(([t, h]) => {
        setTicket(t);
        setHistory(h);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullPage label="Loading ticket…" />;
  if (!ticket) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <button
        onClick={() => navigate('/admin/tickets')}
        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to All Tickets
      </button>

      <div className="rounded-xl2 border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-text-secondary">{ticket.ticketNumber}</span>
            <h2 className="font-display text-lg font-semibold text-text-primary">{ticket.title}</h2>
          </div>
          <div className="flex gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <p className="mt-4 text-sm text-text-secondary">{ticket.description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <TagIcon className="h-4 w-4" /> {ticket.categoryName}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4" /> {ticket.location}
          </span>
          <span>Reported by {ticket.createdByName} on {formatDateTime(ticket.createdAt)}</span>
        </div>

        {ticket.issueImageUrl && (
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-text-secondary">Issue photo</span>
            <img src={ticket.issueImageUrl} alt="Issue" className="max-h-64 rounded-lg border border-border object-cover" />
          </div>
        )}

        {ticket.assignedToName && (
          <div className="mt-4 rounded-lg bg-card-alt px-3 py-2.5 text-sm text-text-secondary">
            Assigned to <span className="font-medium text-text-primary">{ticket.assignedToName}</span>
            {ticket.coordinatorName && <> · Coordinator: <span className="font-medium text-text-primary">{ticket.coordinatorName}</span></>}
          </div>
        )}

        {ticket.workRemarks && (
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-text-secondary">Technician remarks</span>
            <p className="text-sm text-text-primary">{ticket.workRemarks}</p>
          </div>
        )}

        {ticket.completionImageUrl && (
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-text-secondary">Completion photo</span>
            <img
              src={ticket.completionImageUrl}
              alt="Completion proof"
              className="max-h-64 rounded-lg border border-border object-cover"
            />
          </div>
        )}
      </div>

      <div className="rounded-xl2 border border-border bg-card p-5 shadow-soft sm:p-6">
        <h3 className="mb-4 font-display text-sm font-semibold text-text-primary">Ticket history</h3>
        <TicketTimeline history={history} />
      </div>
    </div>
  );
}
