import React from 'react';

const Toggle = ({ checked, onChange, label, description, id }) => {
  const toggleId = id || `toggle-${label?.replace(/\s/g, '-')}`;

  return (
    <div className="settings-toggle-row">
      <div>
        <label htmlFor={toggleId} className="text-sm font-medium text-gray-900">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        className={`settings-toggle ${checked ? 'settings-toggle-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="settings-toggle-knob" />
      </button>
    </div>
  );
};

export default Toggle;
