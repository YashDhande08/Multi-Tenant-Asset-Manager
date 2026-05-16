import React from 'react';
import Button from '../common/Button';

const SettingsSaveBar = ({ dirty, saving, onSave, onDiscard }) => {
  if (!dirty) return null;

  return (
    <div className="settings-save-bar">
      <p className="text-sm text-gray-600">You have unsaved changes</p>
      <div className="flex gap-2">
        <Button variant="secondary" type="button" onClick={onDiscard} disabled={saving}>
          Discard
        </Button>
        <Button type="button" onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsSaveBar;
