import { STATUS_LABELS, STATUS_BADGE_CLASSES, PRIORITY_LABELS, PRIORITY_BADGE_CLASSES } from '../../utils/constants';

export function StatusBadge({ status }) {
  const classes = STATUS_BADGE_CLASSES[status] || 'bg-card-alt text-text-secondary';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const classes = PRIORITY_BADGE_CLASSES[priority] || 'bg-card-alt text-text-secondary';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}

export default StatusBadge;
