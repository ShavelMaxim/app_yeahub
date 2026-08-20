import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/entities/user';
import { isTokenExpired } from '@/shared/lib';
import type { AuthResponse } from './types';

const TOKEN_KEY = 'yeahub_access_token';

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !isTokenExpired(token)) return token;
  localStorage.removeItem(TOKEN_KEY);
  return null;
};

export interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: readStoredToken(),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.access_token;
      state.user = action.payload.user ?? null;
      localStorage.setItem(TOKEN_KEY, action.payload.access_token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem(TOKEN_KEY, action.payload);
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { setCredentials, setToken, setUser, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
