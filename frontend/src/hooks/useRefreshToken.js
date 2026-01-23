import { useEffect } from 'react';
import { useAuth } from './useAuth';
import authService from '../services/auth.service';

const useRefreshToken = () => {
  const { setUser } = useAuth();

  const refresh = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await authService.refreshToken(refreshToken);
      
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data.accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw error;
    }
  };

  return { refresh };
};

export default useRefreshToken;

