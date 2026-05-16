import React from 'react';

const Loader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full animate-spin border-4 theme-transition`}
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-primary) 35%, transparent)',
        borderTopColor: 'var(--accent-primary)',
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
