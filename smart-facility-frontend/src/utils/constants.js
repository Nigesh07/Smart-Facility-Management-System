export const ROLES = {
  USER: 'USER',
  COORDINATOR: 'COORDINATOR',
  TECHNICIAN: 'TECHNICIAN',
  ADMIN: 'ADMIN',
};

export const TICKET_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CLOSED: 'CLOSED',
};

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const TECHNICIAN_SPECIALIZATION = {
  ELECTRICAL: 'ELECTRICAL',
  PLUMBING: 'PLUMBING',
  IT_SUPPORT: 'IT_SUPPORT',
  CLEANING: 'CLEANING',
  TRANSPORT: 'TRANSPORT',
  GENERAL_MAINTENANCE: 'GENERAL_MAINTENANCE',
};

export const SPECIALIZATION_LABELS = {
  ELECTRICAL: 'Electrical',
  PLUMBING: 'Plumbing',
  IT_SUPPORT: 'IT Support',
  CLEANING: 'Cleaning',
  TRANSPORT: 'Transport',
  GENERAL_MAINTENANCE: 'General Maintenance',
};

export const STATUS_LABELS = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
};

export const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// Tailwind class lookups for status badges (uses tokens defined in tailwind.config.js)
export const STATUS_BADGE_CLASSES = {
  PENDING: 'bg-status-pending-soft text-status-pending',
  ASSIGNED: 'bg-status-assigned-soft text-status-assigned',
  IN_PROGRESS: 'bg-status-progress-soft text-status-progress',
  COMPLETED: 'bg-status-completed-soft text-status-completed',
  CLOSED: 'bg-status-closed-soft text-status-closed',
};

export const PRIORITY_BADGE_CLASSES = {
  LOW: 'bg-status-closed-soft text-status-closed',
  MEDIUM: 'bg-status-assigned-soft text-status-assigned',
  HIGH: 'bg-status-pending-soft text-status-pending',
  CRITICAL: 'bg-status-critical-soft text-status-critical',
};

export const ROLE_BADGE_CLASSES = {
  USER: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  COORDINATOR: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
  TECHNICIAN: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400',
  ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
};
