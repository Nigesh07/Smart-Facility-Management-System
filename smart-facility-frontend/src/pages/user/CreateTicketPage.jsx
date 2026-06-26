import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import TicketForm from '../../components/tickets/TicketForm';
import Loader from '../../components/common/Loader';
import { categoryService } from '../../services/categoryService';
import { ticketService } from '../../services/ticketService';

export default function CreateTicketPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService
      .getActiveCategories()
      .then(setCategories)
      .catch((err) => {
        console.error('Failed to load categories', err);
        setError('Could not load categories: ' + (err.message || 'Network Error'));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(payload) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await ticketService.createTicket(payload);
      setSuccess(created.ticketNumber);
      setTimeout(() => navigate('/user/tickets'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader fullPage label="Loading form…" />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="font-display text-base font-semibold text-text-primary">Report a facility issue</h2>
        <p className="text-sm text-text-secondary">
          Give as much detail as you can — it helps the coordinator route this to the right technician.
        </p>
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-status-completed-soft px-3 py-2.5 text-sm text-status-completed">
          <CheckCircleIcon className="h-5 w-5" />
          Ticket {success} created. Redirecting to My Tickets…
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-status-critical-soft px-3 py-2.5 text-sm text-status-critical">
          {error}
        </div>
      )}

      <div className="rounded-xl2 border border-border bg-card p-5 shadow-soft sm:p-6">
        <TicketForm categories={categories} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
