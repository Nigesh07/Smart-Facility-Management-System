import React, { useState, useRef } from 'react';
import { PhotoIcon, XCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export default function FileUploader({ label, onUpload, existingUrl, disabled = false }) {
  const [preview, setPreview] = useState(existingUrl || null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File size must be under 5MB');
      return;
    }

    setError(null);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await onUpload(file);
      setPreview(url);
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function clearImage() {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-text-primary">{label}</span>}

      {preview ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-border">
          <img src={preview} alt="Preview" className="h-40 w-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-2 rounded-full bg-card/90 p-1 text-text-secondary hover:text-status-critical"
              aria-label="Remove image"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>
      ) : (
        <label
          className={`flex w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card-alt px-4 py-6 text-center transition-colors hover:bg-border/30 ${disabled ? 'pointer-events-none opacity-60' : ''}`}
        >
          <PhotoIcon className="h-8 w-8 text-text-secondary" />
          <span className="text-sm text-text-secondary">Click to upload an image</span>
          <span className="text-xs text-text-secondary">JPG, PNG, WEBP — up to 5MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>
      )}

      {fileName && !error && (
        <span className="flex items-center gap-1 text-xs text-text-secondary">
          <ArrowUpTrayIcon className="h-3.5 w-3.5" /> {fileName}
        </span>
      )}
      {error && <span className="text-xs text-status-critical">{error}</span>}
    </div>
  );
}
