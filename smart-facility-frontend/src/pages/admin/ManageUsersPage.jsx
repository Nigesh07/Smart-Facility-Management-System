import React, { useEffect, useState, useMemo } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { userService } from '../../services/userService';
import { ROLES, SPECIALIZATION_LABELS } from '../../utils/constants';

const ROLE_OPTIONS = [
  { value: ROLES.USER, label: 'User' },
  { value: ROLES.COORDINATOR, label: 'Coordinator' },
  { value: ROLES.TECHNICIAN, label: 'Technician' },
];

const SPECIALIZATION_OPTIONS = Object.entries(SPECIALIZATION_LABELS).map(([value, label]) => ({ value, label }));

const EMPTY_FORM = { fullName: '', email: '', password: '', phoneNumber: '', role: '', specialization: '' };

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [actionError, setActionError] = useState(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!roleFilter) return users;
    return users.filter((u) => u.role === roleFilter);
  }, [users, roleFilter]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.password.trim()) next.password = 'Temporary password is required';
    if (!form.role) next.role = 'Role is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setActionError(null);
    try {
      await userService.createUser({
        ...form,
        specialization: form.role === ROLES.TECHNICIAN ? form.specialization || null : null,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      await loadUsers();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(user) {
    setActionError(null);
    try {
      await userService.updateUserStatus(user.id, !user.active);
      await loadUsers();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to update user status');
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Delete ${user.fullName}? This cannot be undone.`)) return;
    setActionError(null);
    try {
      await userService.deleteUser(user.id);
      await loadUsers();
      alert(`User ${user.fullName} deleted successfully.`);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to delete user');
    }
  }

  if (loading) return <Loader fullPage label="Loading users…" />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          name="roleFilter"
          placeholder="All roles"
          allowEmpty
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[...ROLE_OPTIONS, { value: ROLES.ADMIN, label: 'Admin' }]}
          className="w-48"
        />
        <Button icon={PlusIcon} onClick={() => setShowModal(true)}>
          New user
        </Button>
      </div>

      {actionError && (
        <div className="rounded-lg bg-status-critical-soft px-3 py-2.5 text-sm text-status-critical">{actionError}</div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="No users found" description="Create the first account for this role." />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-border bg-card shadow-soft">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Specialization</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{u.fullName}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.role}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {u.specialization ? SPECIALIZATION_LABELS[u.specialization] : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u)}
                      disabled={u.role === ROLES.ADMIN}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                        u.active
                          ? 'bg-status-completed-soft text-status-completed hover:opacity-80'
                          : 'bg-status-closed-soft text-status-closed hover:opacity-80'
                      }`}
                    >
                      {u.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== ROLES.ADMIN && (
                      <button
                        onClick={() => handleDelete(u)}
                        className="rounded-md p-1.5 text-text-secondary hover:bg-status-critical-soft hover:text-status-critical"
                        aria-label={`Delete ${u.fullName}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create account"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={handleCreate}>
              Create account
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Full name"
            name="fullName"
            required
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
          <Input
            label="Temporary password"
            type="text"
            name="password"
            required
            placeholder="They'll change this after first login"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
          />
          <Input
            label="Phone number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
          />
          <Select
            label="Role"
            name="role"
            required
            placeholder="Select role"
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            options={ROLE_OPTIONS}
            error={errors.role}
          />
          {form.role === ROLES.TECHNICIAN && (
            <Select
              label="Specialization"
              name="specialization"
              placeholder="Select specialization (optional)"
              allowEmpty
              value={form.specialization}
              onChange={(e) => update('specialization', e.target.value)}
              options={SPECIALIZATION_OPTIONS}
            />
          )}
        </form>
      </Modal>
    </div>
  );
}
