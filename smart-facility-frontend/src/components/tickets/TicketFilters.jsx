import Select from '../common/Select';
import Input from '../common/Input';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

export default function TicketFilters({
  filters,
  onChange,
  categories = [],
  showStatus = true,
  showPriority = true,
  showCategory = true,
  showSearch = true,
}) {
  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
  const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }));
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-border bg-card p-4 shadow-soft sm:flex-row sm:flex-wrap sm:items-end">
      {showSearch && (
        <Input
          name="search"
          placeholder="Search by title, ticket number, location…"
          value={filters.search || ''}
          onChange={(e) => update('search', e.target.value)}
          className="sm:w-64"
        />
      )}
      {showStatus && (
        <Select
          name="status"
          placeholder="All statuses"
          value={filters.status || ''}
          onChange={(e) => update('status', e.target.value)}
          options={statusOptions}
          allowEmpty
          className="sm:w-48"
        />
      )}
      {showPriority && (
        <Select
          name="priority"
          placeholder="All priorities"
          value={filters.priority || ''}
          onChange={(e) => update('priority', e.target.value)}
          options={priorityOptions}
          allowEmpty
          className="sm:w-48"
        />
      )}
      {showCategory && (
        <Select
          name="categoryId"
          placeholder="All categories"
          value={filters.categoryId || ''}
          onChange={(e) => update('categoryId', e.target.value)}
          options={categoryOptions}
          allowEmpty
          className="sm:w-48"
        />
      )}
    </div>
  );
}
