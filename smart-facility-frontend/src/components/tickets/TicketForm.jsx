import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import FileUploader from '../common/FileUploader';
import { PRIORITY_LABELS } from '../../utils/constants';
import { uploadService } from '../../services/uploadService';

const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }));

export default function TicketForm({ categories, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    priority: '',
    categoryId: '',
    issueImageUrl: '',
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.location.trim()) next.location = 'Location is required';
    if (!form.priority) next.priority = 'Priority is required';
    if (!form.categoryId) next.categoryId = 'Category is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, categoryId: Number(form.categoryId) });
  }

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Issue title"
        name="title"
        required
        placeholder="e.g. Fan not working"
        value={form.title}
        onChange={(e) => update('title', e.target.value)}
        error={errors.title}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary">
          Description<span className="text-status-critical ml-0.5">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Describe the issue in detail…"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className={`w-full rounded-lg border bg-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary
            focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1
            ${errors.description ? 'border-status-critical' : 'border-border'}`}
        />
        {errors.description && <span className="text-xs text-status-critical">{errors.description}</span>}
      </div>

      <Input
        label="Location"
        name="location"
        required
        placeholder="e.g. Block A - Room 205"
        value={form.location}
        onChange={(e) => update('location', e.target.value)}
        error={errors.location}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label="Category"
          name="categoryId"
          required
          placeholder="Select category"
          value={form.categoryId}
          onChange={(e) => update('categoryId', e.target.value)}
          options={categoryOptions}
          error={errors.categoryId}
        />
        <Select
          label="Priority"
          name="priority"
          required
          placeholder="Select priority"
          value={form.priority}
          onChange={(e) => update('priority', e.target.value)}
          options={PRIORITY_OPTIONS}
          error={errors.priority}
        />
      </div>

      <FileUploader
        label="Issue photo (optional)"
        onUpload={async (file) => {
          const url = await uploadService.uploadTicketIssueImage(file);
          update('issueImageUrl', url);
          return url;
        }}
      />

      <Button type="submit" loading={submitting} className="self-start">
        Submit ticket
      </Button>
    </form>
  );
}
