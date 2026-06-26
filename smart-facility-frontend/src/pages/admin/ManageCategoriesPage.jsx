import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { categoryService } from '../../services/categoryService';

const EMPTY_FORM = { name: '', description: '' };

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  }

  function openEditModal(category) {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description || '' });
    setErrors({});
    setShowModal(true);
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Category name is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setActionError(null);
    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, form);
      } else {
        await categoryService.createCategory(form);
      }
      setShowModal(false);
      await loadCategories();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(category) {
    setActionError(null);
    try {
      await categoryService.updateCategoryStatus(category.id, !category.active);
      await loadCategories();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to update category status');
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete category "${category.name}"? This cannot be undone.`)) return;
    setActionError(null);
    try {
      await categoryService.deleteCategory(category.id);
      await loadCategories();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to delete category');
    }
  }

  if (loading) return <Loader fullPage label="Loading categories…" />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button icon={PlusIcon} onClick={openCreateModal}>
          New category
        </Button>
      </div>

      {actionError && (
        <div className="rounded-lg bg-status-critical-soft px-3 py-2.5 text-sm text-status-critical">{actionError}</div>
      )}

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create one to start routing tickets." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="flex flex-col gap-2 rounded-xl2 border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-sm font-semibold text-text-primary">{c.name}</h3>
                <button
                  onClick={() => toggleStatus(c)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-80 ${
                    c.active ? 'bg-status-completed-soft text-status-completed' : 'bg-status-closed-soft text-status-closed'
                  }`}
                >
                  {c.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              {c.description && <p className="text-sm text-text-secondary">{c.description}</p>}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand-soft"
                >
                  <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-status-critical hover:bg-status-critical-soft"
                >
                  <TrashIcon className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit category' : 'New category'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={handleSave}>
              Save
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Name"
            name="name"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            error={errors.name}
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
