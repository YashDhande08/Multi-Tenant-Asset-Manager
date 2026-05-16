import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';

const UserProfileSection = ({ profile, onChange, errors }) => {
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ profilePhotoUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const initials =
    profile.name?.charAt(0)?.toUpperCase() ||
    profile.email?.charAt(0)?.toUpperCase() ||
    'U';

  return (
    <motion.section
      className="settings-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="settings-card-title">Profile information</h2>
      <p className="settings-card-desc">Update your photo and personal details.</p>

      <div className="settings-avatar-upload">
        {profile.profilePhotoUrl ? (
          <img src={profile.profilePhotoUrl} alt="" className="settings-avatar" />
        ) : (
          <div className="settings-avatar">{initials}</div>
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
            Upload photo
          </Button>
          <p className="text-xs text-gray-500 mt-2">JPG or PNG. Max 2MB.</p>
        </div>
      </div>

      <div className="settings-grid-2 mt-6">
        <div className="settings-field">
          <label className="settings-label" htmlFor="profile-name">Full name</label>
          <input
            id="profile-name"
            className="settings-input"
            value={profile.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          {errors?.name && <p className="settings-error-text">{errors.name}</p>}
        </div>
        <div className="settings-field">
          <label className="settings-label" htmlFor="profile-email">Email</label>
          <input id="profile-email" className="settings-input" value={profile.email || ''} disabled />
          <p className="text-xs text-gray-500 mt-1">Contact an admin to change your email.</p>
        </div>
        <div className="settings-field">
          <label className="settings-label" htmlFor="profile-phone">Phone</label>
          <input
            id="profile-phone"
            className="settings-input"
            value={profile.phone || ''}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 555 000 0000"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default UserProfileSection;
