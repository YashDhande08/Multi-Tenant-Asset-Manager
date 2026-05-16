import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsLayout from '../SettingsLayout';
import SettingsSaveBar from '../SettingsSaveBar';
import UserProfileSection from './UserProfileSection';
import UserPasswordSection from './UserPasswordSection';
import UserPreferencesSection from './UserPreferencesSection';
import settingsService from '../../../services/settings.service';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../context/ToastContext';
import Loader from '../../common/Loader';
import DashboardLayout from '../../layout/DashboardLayout';

const USER_NAV = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'password', label: 'Password', icon: '🔒' },
  { id: 'preferences', label: 'Preferences', icon: '✨' },
];

const UserSettings = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [active, setActive] = useState('profile');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const [profile, setProfile] = useState({ name: '', email: '', phone: '', profilePhotoUrl: '' });
  const [savedProfile, setSavedProfile] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [savedPreferences, setSavedPreferences] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getProfile();
      const p = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        profilePhotoUrl: data.profilePhotoUrl || '',
      };
      setProfile(p);
      setSavedProfile(p);
      const prefs = data.preferences || {};
      setPreferences(prefs);
      setSavedPreferences(prefs);
    } catch (e) {
      toast.error(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const profileDirty = useMemo(
    () => JSON.stringify(profile) !== JSON.stringify(savedProfile),
    [profile, savedProfile]
  );
  const prefsDirty = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(savedPreferences),
    [preferences, savedPreferences]
  );
  const dirty = (active === 'profile' && profileDirty) || (active === 'preferences' && prefsDirty);

  const filteredNav = USER_NAV.filter((n) =>
    n.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      if (active === 'profile') {
        if (!profile.name?.trim()) {
          setErrors({ name: 'Name is required' });
          return;
        }
        const data = await settingsService.updateProfile({
          name: profile.name,
          phone: profile.phone,
          profilePhotoUrl: profile.profilePhotoUrl,
        });
        const p = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          profilePhotoUrl: data.profilePhotoUrl || '',
        };
        setProfile(p);
        setSavedProfile(p);
        refreshUser?.(data);
        toast.success('Profile saved');
      } else if (active === 'preferences') {
        const data = await settingsService.updateProfile({ preferences });
        setSavedPreferences(data.preferences || preferences);
        toast.success('Preferences saved');
      }
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (active === 'profile') setProfile(savedProfile);
    if (active === 'preferences') setPreferences(savedPreferences);
  };

  const handlePasswordSubmit = async () => {
    const nextErrors = {};
    if (!passwords.currentPassword) nextErrors.currentPassword = 'Required';
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      nextErrors.newPassword = 'At least 6 characters';
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setPwSaving(true);
    try {
      await settingsService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      toast.success('Password updated');
    } catch (e) {
      toast.error(e.message || 'Password update failed');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <SettingsLayout title="Settings" subtitle="Loading your account...">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout
      title="Settings"
      subtitle={`Manage your account, ${user?.name || user?.email}`}
      search={search}
      onSearchChange={setSearch}
      sidebar={filteredNav.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`settings-nav-btn ${active === item.id ? 'settings-nav-btn-active' : ''}`}
          onClick={() => setActive(item.id)}
        >
          <span aria-hidden>{item.icon}</span>
          {item.label}
        </button>
      ))}
      saveBar={
        <SettingsSaveBar
          dirty={dirty}
          saving={saving}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.25 }}
        >
          {active === 'profile' && (
            <UserProfileSection
              profile={profile}
              onChange={(patch) => setProfile((p) => ({ ...p, ...patch }))}
              errors={errors}
            />
          )}
          {active === 'password' && (
            <UserPasswordSection
              passwords={passwords}
              onChange={(patch) => setPasswords((p) => ({ ...p, ...patch }))}
              errors={errors}
              onSubmit={handlePasswordSubmit}
              saving={pwSaving}
            />
          )}
          {active === 'preferences' && (
            <UserPreferencesSection
              preferences={preferences}
              onChange={(patch) => setPreferences((p) => ({ ...p, ...patch }))}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </SettingsLayout>
  );
};

export default UserSettings;
