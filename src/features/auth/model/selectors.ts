import { useSelector } from 'react-redux';
import { isTokenExpired } from '@/shared/lib';
import type { AuthState } from './authSlice';

interface StateWithAuth {
  auth: AuthState;
}

export const selectIsSessionValid = (state: StateWithAuth): boolean =>
  Boolean(state.auth.token && !isTokenExpired(state.auth.token));

export const useAuth = () => {
  const auth = useSelector((state: StateWithAuth) => state.auth);
  return { ...auth, isSessionValid: Boolean(auth.token && !isTokenExpired(auth.token)) };
};
