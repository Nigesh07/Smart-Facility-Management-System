import { useNavigate } from 'react-router-dom';
import { MapPinIcon, TagIcon } from '@heroicons/react/24/outline';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/formatDate';

export default function TicketCard({ ticket, basePath }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`${basePath}/${ticket.id}`)}
      className="flex w-full flex-col gap-3 rounded-xl2 border border-border bg-card p-4 text-left shadow-soft transition-shadow hover:shadow-soft-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-text-secondary">{ticket.ticketNumber}</span>
          <span className="font-display text-sm font-semibold text-text-primary">{ticket.title}</span>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <TagIcon className="h-3.5 w-3.5" /> {ticket.categoryName}
        </span>
        <span className="flex items-center gap-1">
          <MapPinIcon className="h-3.5 w-3.5" /> {ticket.location}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <PriorityBadge priority={ticket.priority} />
        <span className="text-xs text-text-secondary">{formatDate(ticket.createdAt)}</span>
      </div>
    </button>
  );
}
