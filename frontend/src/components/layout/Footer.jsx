import React from 'react';

const Footer = () => {
  return (
    <footer
      className="py-4 mt-auto border-t theme-transition"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Multi-Tenant PAM System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
