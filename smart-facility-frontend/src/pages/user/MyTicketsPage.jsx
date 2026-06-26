import React, { useEffect, useState, useMemo } from 'react';
import TicketTable from '../../components/tickets/TicketTable';
import TicketFilters from '../../components/tickets/TicketFilters';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { categoryService } from '../../services/categoryService';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    Promise.all([ticketService.getMyTickets(), categoryService.getActiveCategories()])
      .then(([t, c]) => {
        setTickets(t);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.categoryId && String(t.categoryId) !== filters.categoryId) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${t.ticketNumber} ${t.title} ${t.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tickets, filters]);

  if (loading) return <Loader fullPage label="Loading your tickets…" />;

  return (
    <div className="flex flex-col gap-4">
      <TicketFilters filters={filters} onChange={setFilters} categories={categories} />
      <TicketTable tickets={filtered} basePath="/user/tickets" />
    </div>
  );
}
