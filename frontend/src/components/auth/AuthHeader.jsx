import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const MarkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 18V10M4 18H20M8 18V7M12 18V4M16 18V13"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Header for landing, login, and register: brand, theme toggle, and account CTAs.
 */
const AuthHeader = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const isLanding = location.pathname === '/';
  const isRegister = location.pathname === '/register';

  return (
    <header role="banner" className="auth-header sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-15 sm:h-17">
          <Link
            to="/"
            className="auth-header-brand group flex items-center gap-3 min-w-0 theme-transition"
          >
            <span className="auth-header-mark" aria-hidden>
              <MarkIcon />
            </span>
            <span className="flex flex-col min-w-0 text-left">
              <span className="flex items-baseline gap-1.5 flex-wrap">
                <span className="auth-header-title">PAM</span>
                <span className="auth-header-title-muted">System</span>
              </span>
              <span className="auth-header-badge mt-0.5 hidden sm:block truncate">
                Personal Asset Management
              </span>
            </span>
          </Link>

          <nav
            className="flex items-center gap-2 sm:gap-3 shrink-0"
            aria-label="Account and appearance"
          >
            {isLanding ? (
              <>
                <Link to="/login" className="auth-header-ghost hidden sm:inline-flex">
                  Sign in
                </Link>
                <Link to="/register" className="auth-header-cta hidden sm:inline-flex">
                  Create account
                </Link>
              </>
            ) : isRegister ? (
              <Link to="/login" className="auth-header-ghost hidden sm:inline-flex">
                Sign in
              </Link>
            ) : (
              <Link to="/register" className="auth-header-ghost hidden sm:inline-flex">
                Create account
              </Link>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="auth-header-theme nav-action-btn"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <>
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {isLanding ? (
              <>
                <Link to="/login" className="sm:hidden auth-header-ghost px-3 py-2 text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="sm:hidden auth-header-cta px-3 py-2 text-sm">
                  Register
                </Link>
              </>
            ) : isRegister ? (
              <Link to="/login" className="sm:hidden auth-header-ghost px-3 py-2 text-sm">
                Sign in
              </Link>
            ) : (
              <Link to="/register" className="sm:hidden auth-header-ghost px-3 py-2 text-sm">
                Register
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
