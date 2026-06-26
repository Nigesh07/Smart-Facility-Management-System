import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, TagIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import TicketTimeline from '../../components/tickets/TicketTimeline';
import FileUploader from '../../components/common/FileUploader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { uploadService } from '../../services/uploadService';
import { formatDateTime } from '../../utils/formatDate';
import { TICKET_STATUS } from '../../utils/constants';

export default function TechnicianTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [workRemarks, setWorkRemarks] = useState('');
  const [completionImageUrl, setCompletionImageUrl] = useState('');
  const [error, setError] = useState(null);

  async function loadData() {
    setLoading(true);
    try {
      const [t, h] = await Promise.all([ticketService.getTicketById(id), ticketService.getTicketHistory(id)]);
      setTicket(t);
      setHistory(h);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStartWork() {
    setStarting(true);
    setError(null);
    try {
      await ticketService.startWork(id, '');
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to start work');
    } finally {
      setStarting(false);
    }
  }

  async function handleComplete() {
    if (!workRemarks.trim()) {
      setError('Work remarks are required to mark this ticket as completed');
      return;
    }
    setCompleting(true);
    setError(null);
    try {
      await ticketService.completeTicket(id, workRemarks, completionImageUrl || undefined);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to complete ticket');
    } finally {
      setCompleting(false);
    }
  }

  if (loading) return <Loader fullPage label="Loading ticket…" />;
  if (!ticket) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <button
        onClick={() => navigate('/technician/tickets')}
        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to Assigned Tickets
      </button>

      {error && (
        <div className="rounded-lg bg-status-critical-soft px-3 py-2.5 text-sm text-status-critical">{error}</div>
      )}

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
          <span>Reported on {formatDateTime(ticket.createdAt)}</span>
        </div>

        {ticket.issueImageUrl && (
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-text-secondary">Issue photo</span>
            <img src={ticket.issueImageUrl} alt="Issue" className="max-h-64 rounded-lg border border-border object-cover" />
          </div>
        )}

        {ticket.status === TICKET_STATUS.ASSIGNED && (
          <div className="mt-5">
            <Button icon={PlayIcon} loading={starting} onClick={handleStartWork}>
              Start work
            </Button>
          </div>
        )}

        {ticket.status === TICKET_STATUS.IN_PROGRESS && (
          <div className="mt-5 flex flex-col gap-4 rounded-lg border border-border bg-card-alt p-4">
            <h3 className="font-display text-sm font-semibold text-text-primary">Complete this ticket</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Work remarks<span className="text-status-critical ml-0.5">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe what you did to fix this issue…"
                value={workRemarks}
                onChange={(e) => setWorkRemarks(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
              />
            </div>

            <FileUploader
              label="Completion proof photo (optional)"
              onUpload={async (file) => {
                const url = await uploadService.uploadTicketCompletionImage(file);
                setCompletionImageUrl(url);
                return url;
              }}
            />

            <Button icon={CheckCircleIcon} loading={completing} onClick={handleComplete} className="self-start">
              Mark completed
            </Button>
          </div>
        )}

        {(ticket.status === TICKET_STATUS.COMPLETED || ticket.status === TICKET_STATUS.CLOSED) && ticket.workRemarks && (
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-text-secondary">Your remarks</span>
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
