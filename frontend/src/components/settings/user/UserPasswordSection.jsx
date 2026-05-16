import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'var(--border)' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const colors = ['#ff6b6b', '#f59e0b', '#d4ff00', '#134e4a', '#0f2744'];
  return {
    score,
    label: labels[Math.min(score, 4)],
    color: colors[Math.min(score, 4)],
    width: `${(score / 4) * 100}%`,
  };
};

const UserPasswordSection = ({ passwords, onChange, errors, onSubmit, saving }) => {
  const strength = useMemo(() => getStrength(passwords.newPassword), [passwords.newPassword]);

  return (
    <motion.section
      className="settings-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="settings-card-title">Change password</h2>
      <p className="settings-card-desc">Use a strong password you do not use elsewhere.</p>

      <div className="settings-field max-w-md">
        <label className="settings-label" htmlFor="current-pw">Current password</label>
        <input
          id="current-pw"
          type="password"
          className="settings-input"
          value={passwords.currentPassword}
          onChange={(e) => onChange({ currentPassword: e.target.value })}
          autoComplete="current-password"
        />
        {errors?.currentPassword && <p className="settings-error-text">{errors.currentPassword}</p>}
      </div>

      <div className="settings-grid-2 max-w-2xl">
        <div className="settings-field">
          <label className="settings-label" htmlFor="new-pw">New password</label>
          <input
            id="new-pw"
            type="password"
            className="settings-input"
            value={passwords.newPassword}
            onChange={(e) => onChange({ newPassword: e.target.value })}
            autoComplete="new-password"
          />
          <div className="settings-password-strength">
            <div
              className="settings-password-strength-bar"
              style={{ width: strength.width, background: strength.color }}
            />
          </div>
          {passwords.newPassword && (
            <p className="text-xs mt-1" style={{ color: strength.color }}>
              Strength: {strength.label}
            </p>
          )}
          {errors?.newPassword && <p className="settings-error-text">{errors.newPassword}</p>}
        </div>
        <div className="settings-field">
          <label className="settings-label" htmlFor="confirm-pw">Confirm password</label>
          <input
            id="confirm-pw"
            type="password"
            className="settings-input"
            value={passwords.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            autoComplete="new-password"
          />
          {errors?.confirmPassword && <p className="settings-error-text">{errors.confirmPassword}</p>}
        </div>
      </div>

      <button type="button" className="app-btn-primary px-4 py-2 rounded-md mt-4" onClick={onSubmit} disabled={saving}>
        {saving ? 'Updating...' : 'Update password'}
      </button>
    </motion.section>
  );
};

export default UserPasswordSection;
