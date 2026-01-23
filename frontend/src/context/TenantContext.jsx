import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import tenantService from '../services/tenant.service';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.tenantId) {
      fetchTenant(user.tenantId);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTenant = async (tenantId) => {
    try {
      const response = await tenantService.getTenant(tenantId);
      setTenant(response.data);
    } catch (error) {
      console.error('Error fetching tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

