import React from 'react';

const paths = {
  layers: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  ),
  cycle: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h5M20 20v-5h-5M20 9a8 8 0 00-14.9-3M4 15a8 8 0 0014.9 3" />
  ),
  shield: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ),
  pulse: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </>
  ),
  bell: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  ),
  chart: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18 20V10M12 20V4M6 20v-6" />
  ),
};

const FeatureIcon = ({ name }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    {paths[name] || paths.chart}
  </svg>
);

export default FeatureIcon;
