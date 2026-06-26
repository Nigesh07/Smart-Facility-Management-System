import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { BuildingOffice2Icon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardPathByRole } from '../../utils/getDashboardPathByRole';

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  if (user) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      navigate(getDashboardPathByRole(data.role), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm rounded-xl2 border border-border bg-card p-7 shadow-soft-lg">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-brand-soft text-brand">
            <BuildingOffice2Icon className="h-7 w-7" />
          </span>
          <h1 className="font-display text-xl font-bold text-text-primary">Smart Facility</h1>
          <p className="text-sm text-text-secondary">Sign in with the credentials your administrator provided.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            required
            placeholder="you@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-status-critical-soft px-3 py-2 text-sm text-status-critical">
              <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-secondary">
          Don't have an account? Your organization's admin creates accounts — contact them to get started.
        </p>
      </div>
    </div>
  );
}