import React from 'react';
import { useRole } from '../hooks/useRole';
import AdminSettings from '../components/settings/admin/AdminSettings';
import UserSettings from '../components/settings/user/UserSettings';
import Loader from '../components/common/Loader';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { loading } = useAuth();
  const { isAdmin } = useRole();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return isAdmin ? <AdminSettings /> : <UserSettings />;
};

export default Settings;
