import { useAuth } from './useAuth';

/** Tenant Admin role id in this app */
export const ADMIN_ROLE_ID = 1;

export const useRole = () => {
  const { user } = useAuth();
  const isAdmin = user?.roleId === ADMIN_ROLE_ID;

  return {
    user,
    isAdmin,
    isUser: !isAdmin,
    roleId: user?.roleId,
    roleName: user?.roleName,
  };
};

export default useRole;
