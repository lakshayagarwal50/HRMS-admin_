// src/hooks/useAuth.ts

import { useAppSelector } from '../store/hooks';

/**
 * @description A custom hook to access authentication state from the Redux store.
 * @returns An object with the current auth state.
 */
export const useAuth = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated,
    user,
    loading: isLoading,
  };
};