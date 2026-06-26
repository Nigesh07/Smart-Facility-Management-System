import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { formatDateTime } from '../../utils/formatDate';
import { STATUS_LABELS } from '../../utils/constants';
import EmptyState from '../common/EmptyState';

export default function TicketTimeline({ history }) {
  if (!history || history.length === 0) {
    return <EmptyState title="No history yet" description="Activity on this ticket will appear here." />;
  }

  return (
    <ol className="flex flex-col gap-0">
      {history.map((entry, idx) => (
        <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
          {idx !== history.length - 1 && (
            <span className="absolute left-[11px] top-6 h-[calc(100%-1rem)] w-px bg-border" aria-hidden="true" />
          )}
          <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-brand" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-text-primary">
              {entry.previousStatus ? `${STATUS_LABELS[entry.previousStatus]} → ` : ''}
              {STATUS_LABELS[entry.currentStatus]}
            </span>
            <span className="text-xs text-text-secondary">
              by {entry.updatedByName} · {formatDateTime(entry.actionDate)}
            </span>
            {entry.remarks && <p className="mt-1 text-sm text-text-secondary">{entry.remarks}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
