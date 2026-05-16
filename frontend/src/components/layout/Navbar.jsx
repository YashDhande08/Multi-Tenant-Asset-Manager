import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="app-navbar theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {tenant && (
              <div className="mr-6">
                <p className="text-sm font-semibold text-gray-900">{tenant.name}</p>
                <p className="text-xs text-gray-500">Base Currency: {tenant.baseCurrency}</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:block text-right mr-4">
                  <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500">{user.roleName}</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="nav-action-btn px-3 py-2 text-sm font-medium rounded-lg border theme-transition"
                  style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-action-btn px-4 py-2 text-sm font-medium rounded-lg border theme-transition"
                  style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
