// src/hooks/useAuth.ts

import { useAppSelector } from '../store/hooks';

export const useAuth = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated,
    user,
    loading: isLoading,
  };
};