import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => (
  <footer className="lp-footer">
    <p>
      © {new Date().getFullYear()} TenancyOS ·{' '}
      <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
        Sign in
      </Link>
      {' · '}
      <Link to="/register" style={{ color: 'inherit', textDecoration: 'underline' }}>
        Create account
      </Link>
    </p>
  </footer>
);

export default LandingFooter;
