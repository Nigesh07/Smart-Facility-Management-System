import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, TagIcon, UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import TicketTimeline from '../../components/tickets/TicketTimeline';
import AssignTechnicianModal from '../../components/tickets/AssignTechnicianModal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { ticketService } from '../../services/ticketService';
import { formatDateTime } from '../../utils/formatDate';
import { TICKET_STATUS } from '../../utils/constants';

export default function CoordinatorTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [closing, setClosing] = useState(false);
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

  async function handleAssign(technicianId) {
    setAssigning(true);
    setError(null);
    try {
      await ticketService.assignTechnician(id, technicianId);
      setShowAssignModal(false);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to assign technician');
    } finally {
      setAssigning(false);
    }
  }

  async function handleClose() {
    setClosing(true);
    setError(null);
    try {
      await ticketService.closeTicket(id);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to close ticket');
    } finally {
      setClosing(false);
    }
  }

  if (loading) return <Loader fullPage label="Loading ticket…" />;
  if (!ticket) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <button
        onClick={() => navigate('/coordinator/tickets')}
        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to Manage Tickets
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

        <div className="mt-5 flex flex-wrap gap-2">
          {ticket.status === TICKET_STATUS.PENDING && (
            <Button icon={UserPlusIcon} onClick={() => setShowAssignModal(true)}>
              Assign technician
            </Button>
          )}
          {ticket.status === TICKET_STATUS.COMPLETED && (
            <Button icon={CheckCircleIcon} loading={closing} onClick={handleClose}>
              Verify &amp; close ticket
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl2 border border-border bg-card p-5 shadow-soft sm:p-6">
        <h3 className="mb-4 font-display text-sm font-semibold text-text-primary">Ticket history</h3>
        <TicketTimeline history={history} />
      </div>

      <AssignTechnicianModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        ticket={ticket}
        onAssign={handleAssign}
        assigning={assigning}
      />
    </div>
  );
}
