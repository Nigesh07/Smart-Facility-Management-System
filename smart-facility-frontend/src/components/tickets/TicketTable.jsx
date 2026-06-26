import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/formatDate';
import EmptyState from '../common/EmptyState';
import TicketCard from './TicketCard';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function TicketTable({ tickets, basePath, extraColumns = [] }) {
  const navigate = useNavigate();

  if (!tickets || tickets.length === 0) {
    return <EmptyState icon={ClipboardDocumentListIcon} title="No tickets found" description="There's nothing to show with the current filters." />;
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {tickets.map((t) => (
          <TicketCard key={t.id} ticket={t} basePath={basePath} />
        ))}
      </div>

      {/* Desktop: table, scrolls horizontally if needed */}
      <div className="hidden overflow-x-auto rounded-xl2 border border-border bg-card shadow-soft sm:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3 font-medium">Ticket #</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {extraColumns.map((col) => (
                <th key={col.header} className="px-4 py-3 font-medium">{col.header}</th>
              ))}
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.id}
                onClick={() => navigate(`${basePath}/${t.id}`)}
                className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-card-alt"
              >
                <td className="px-4 py-3 font-medium text-text-primary">{t.ticketNumber}</td>
                <td className="px-4 py-3 text-text-primary">{t.title}</td>
                <td className="px-4 py-3 text-text-secondary">{t.categoryName}</td>
                <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                {extraColumns.map((col) => (
                  <td key={col.header} className="px-4 py-3 text-text-secondary">{col.render(t)}</td>
                ))}
                <td className="px-4 py-3 text-text-secondary">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
