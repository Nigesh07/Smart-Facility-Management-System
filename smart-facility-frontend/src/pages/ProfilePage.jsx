import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import FileUploader from '../components/common/FileUploader';
import Loader from '../components/common/Loader';
import { userService } from '../services/userService';
import { uploadService } from '../services/uploadService';
import { useAuth } from '../hooks/useAuth';
import { ROLES, SPECIALIZATION_LABELS } from '../utils/constants';

const SPECIALIZATION_OPTIONS = Object.entries(SPECIALIZATION_LABELS).map(([value, label]) => ({ value, label }));

export default function ProfilePage() {
  const { updateProfileInfo } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', specialization: '' });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    userService.getProfile().then((data) => {
      setProfile(data);
      setForm({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || '',
        specialization: data.specialization || '',
      });
      setLoading(false);
    });
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const updated = await userService.updateProfile(form);
      setProfile(updated);
      updateProfileInfo({ fullName: updated.fullName });
      setSaveMessage('Profile updated successfully');
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setChangingPassword(true);
    setPasswordMessage(null);
    try {
      await userService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordMessage('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordErrors({ currentPassword: err?.response?.data?.message || 'Failed to change password' });
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) return <Loader fullPage label="Loading profile…" />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="rounded-xl2 border border-border bg-card p-5 shadow-soft sm:p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-text-primary">Profile photo</h2>
        <FileUploader
          existingUrl={profile.profileImageUrl}
          onUpload={async (file) => uploadService.uploadProfileImage(file)}
        />
      </div>

      <div className="rounded-xl2 border border-border bg-card p-5 shadow-soft sm:p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-text-primary">Account details</h2>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <Input label="Full name" name="fullName" required value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          <Input label="Email" name="email" value={profile.email} disabled />
          <Input label="Phone number" name="phoneNumber" value={form.phoneNumber}
            onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
          <Input label="Role" name="role" value={profile.role} disabled />

          {profile.role === ROLES.TECHNICIAN && (
            <Select
              label="Specialization"
              name="specialization"
              placeholder="Select specialization"
              allowEmpty
              value={form.specialization}
              onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
              options={SPECIALIZATION_OPTIONS}
            />
          )}

          {saveMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-status-completed-soft px-3 py-2 text-sm text-status-completed">
              <CheckCircleIcon className="h-4 w-4" /> {saveMessage}
            </div>
          )}
          {saveError && (
            <div className="rounded-lg bg-status-critical-soft px-3 py-2 text-sm text-status-critical">{saveError}</div>
          )}

          <Button type="submit" loading={saving} className="self-start">
            Save changes
          </Button>
        </form>
      </div>

      <div className="rounded-xl2 border border-border bg-card p-5 shadow-soft sm:p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-text-primary">Change password</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <Input
            label="Current password"
            type="password"
            name="currentPassword"
            required
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
            error={passwordErrors.currentPassword}
          />
          <Input
            label="New password"
            type="password"
            name="newPassword"
            required
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
            error={passwordErrors.newPassword}
          />
          <Input
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            required
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            error={passwordErrors.confirmPassword}
          />

          {passwordMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-status-completed-soft px-3 py-2 text-sm text-status-completed">
              <CheckCircleIcon className="h-4 w-4" /> {passwordMessage}
            </div>
          )}

          <Button type="submit" loading={changingPassword} className="self-start">
            Change password
          </Button>
        </form>
      </div>
    </div>
  );
}
