import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import './settings.css';

const SettingsLayout = ({ title, subtitle, badge, search, onSearchChange, sidebar, children, saveBar }) => (
  <DashboardLayout>
    <motion.div
      className="settings-shell page-content-enter"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="settings-header">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-gray-600 mt-1 text-sm sm:text-base">{subtitle}</p>}
        </div>
        {onSearchChange && (
          <input
            type="search"
            className="settings-search"
            placeholder="Search settings..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search settings"
          />
        )}
      </header>

      <div className="settings-body">
        <nav className="settings-sidebar" aria-label="Settings sections">
          {sidebar}
        </nav>
        <div className="settings-content">{children}</div>
      </div>

      {saveBar}
    </motion.div>
  </DashboardLayout>
);

export default SettingsLayout;
