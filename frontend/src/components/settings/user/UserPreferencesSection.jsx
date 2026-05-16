import React from 'react';
import { motion } from 'framer-motion';
import Toggle from '../../common/Toggle';
import { useTheme } from '../../../context/ThemeContext';

const UserPreferencesSection = ({ preferences, onChange }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const setThemeMode = (mode) => {
    onChange({
      theme: mode,
    });
    if (mode === 'dark' && !isDark) toggleTheme();
    if (mode === 'light' && isDark) toggleTheme();
  };

  const themeMode = preferences.theme || theme;

  return (
    <motion.section
      className="settings-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="settings-card-title">Personal preferences</h2>
      <p className="settings-card-desc">Customize how the app looks and notifies you.</p>

      <div className="settings-field max-w-xs">
        <label className="settings-label" htmlFor="pref-lang">Language</label>
        <select
          id="pref-lang"
          className="settings-select"
          value={preferences.language || 'en'}
          onChange={(e) => onChange({ language: e.target.value })}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <div className="mt-4 mb-2">
        <p className="settings-label mb-2">Appearance</p>
        <div className="flex flex-wrap gap-2">
          {['light', 'dark', 'system'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={`settings-nav-btn ${themeMode === mode ? 'settings-nav-btn-active' : ''}`}
              onClick={() => setThemeMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Toggle
        label="Email notifications"
        description="Receive updates about assets and reports"
        checked={preferences.emailNotifications !== false}
        onChange={(v) => onChange({ emailNotifications: v })}
      />
      <Toggle
        label="Maintenance reminders"
        description="Alerts for scheduled asset maintenance"
        checked={!!preferences.maintenanceReminders}
        onChange={(v) => onChange({ maintenanceReminders: v })}
      />
      <Toggle
        label="Weekly digest"
        description="Summary of portfolio changes every Monday"
        checked={!!preferences.weeklyDigest}
        onChange={(v) => onChange({ weeklyDigest: v })}
      />
    </motion.section>
  );
};

export default UserPreferencesSection;
