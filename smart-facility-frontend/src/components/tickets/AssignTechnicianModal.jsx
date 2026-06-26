import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { userService } from '../../services/userService';
import { SPECIALIZATION_LABELS } from '../../utils/constants';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function AssignTechnicianModal({ isOpen, onClose, ticket, onAssign, assigning }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!isOpen || !ticket) return;

    setLoading(true);
    setSelectedId(null);
    userService
      .getAvailableTechnicians(ticket.categoryName ? mapCategoryToSpecialization(ticket.categoryName) : undefined)
      .then(setTechnicians)
      .finally(() => setLoading(false));
  }, [isOpen, ticket]);

  function mapCategoryToSpecialization(categoryName) {
    const normalized = categoryName.toUpperCase().replace(/\s+/g, '_');
    if (normalized.includes('IT')) return 'IT_SUPPORT';
    if (normalized.includes('ELECTRICAL')) return 'ELECTRICAL';
    if (normalized.includes('PLUMBING')) return 'PLUMBING';
    if (normalized.includes('CLEANING')) return 'CLEANING';
    if (normalized.includes('TRANSPORT')) return 'TRANSPORT';
    return 'GENERAL_MAINTENANCE';
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign technician — ${ticket?.ticketNumber || ''}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!selectedId} loading={assigning} onClick={() => onAssign(selectedId)}>
            Assign
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="py-6 text-center text-sm text-text-secondary">Loading technicians…</div>
      ) : technicians.length === 0 ? (
        <EmptyState icon={UserGroupIcon} title="No active technicians available" />
      ) : (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {technicians.map((tech) => (
            <li key={tech.id}>
              <button
                onClick={() => setSelectedId(tech.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  selectedId === tech.id ? 'border-brand bg-brand-soft' : 'border-border hover:bg-card-alt'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">{tech.fullName}</span>
                  <span className="text-xs text-text-secondary">
                    {SPECIALIZATION_LABELS[tech.specialization] || 'General'}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  {tech.activeAssignedTicketCount ?? 0} active
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
