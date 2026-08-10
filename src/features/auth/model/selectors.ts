import { useSelector } from 'react-redux';
import type { AuthState } from './authSlice';

interface StateWithAuth {
  auth: AuthState;
}

export const useAuth = () => useSelector((state: StateWithAuth) => state.auth);
