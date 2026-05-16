import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import Loader from '../common/Loader';

/**
 * Restricts route to tenant admins (roleId === 1).
 */
const AdminRoute = ({ children }) => {
  const { loading } = useAuth();
  const { isAdmin } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/settings" replace />;
  }

  return children;
};

export default AdminRoute;
