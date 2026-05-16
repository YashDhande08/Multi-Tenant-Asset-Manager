import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/assets', label: 'Assets', icon: '💰' },
    { path: '/liabilities', label: 'Liabilities', icon: '📉' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  if (user?.roleId === 1) {
    menuItems.splice(4, 0, { path: '/users', label: 'Users', icon: '👥' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="app-sidebar w-64 min-h-screen flex flex-col theme-transition">
      <div className="p-6 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--sidebar-text)' }}>
          PAM System
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--sidebar-muted)' }}>
          Asset Management
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                  isActive(item.path) ? 'app-sidebar-link-active' : 'app-sidebar-link'
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center px-4 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 theme-transition"
            style={{
              backgroundColor: 'var(--sidebar-active)',
              color: 'var(--sidebar-active-fg)',
            }}
          >
            <span className="text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--sidebar-text)' }}>
              {user?.name || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--sidebar-muted)' }}>
              {user?.roleName || 'Standard User'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
