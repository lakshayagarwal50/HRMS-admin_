// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthChange } from '../services';
import { setUser, setLoading } from '../features/auth/authSlice';
import type { RootState } from '../store/store';
import type { User } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(setLoading());
    const unsubscribe = onAuthChange((user: User | null) => {
      dispatch(setUser(user));
    });
    return unsubscribe;
  }, [dispatch]);

  return authState;
};