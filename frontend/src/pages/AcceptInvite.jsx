import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const AcceptInvite = () => {
  const navigate = useNavigate();
  // Invite token from route params.
  const { token } = useParams();

  const inviteToken = useMemo(() => token || '', [token]);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  // Indicates API request progress.
  const [loading, setLoading] = useState(false);
  // Stores validation/server error to display.
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!inviteToken) {
      setError('Invalid invitation link');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authService.acceptInvite({
        token: inviteToken,
        password: formData.password,
        name: formData.name || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center theme-transition bg-[var(--background)] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6 page-content-enter">
        <h1 className="text-2xl font-bold text-gray-900">Accept Invitation</h1>
        <p className="text-gray-600 mt-1">
          Set your password to activate your account.
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Input
            label="Full Name (optional)"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Activating...' : 'Activate Account'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Already have an account? <Link className="text-blue-600 hover:text-blue-700" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;

