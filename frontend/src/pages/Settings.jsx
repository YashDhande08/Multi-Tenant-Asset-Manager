import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <Card title="Account Settings">
          <p className="text-gray-600">Settings functionality coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

