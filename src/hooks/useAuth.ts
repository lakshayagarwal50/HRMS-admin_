// src/hooks/useAuth.ts

import { useAppSelector } from '../store/hooks'; // Import our new typed selector

/**
 * @description A custom hook to access authentication state from the Redux store.
 * @returns An object with the current user, authentication status, and loading state.
 */
export const useAuth = () => {
  // Select the needed state properties from the auth slice in the Redux store
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  // Return the values needed by components like ProtectedRoute
  // We rename isLoading to 'loading' to match what your ProtectedRoute expects
  return {
    isAuthenticated,
    user,
    loading: isLoading,
  };
};