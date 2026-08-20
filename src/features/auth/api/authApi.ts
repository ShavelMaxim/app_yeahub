import { baseApi } from '@/shared/api';
import type { AuthResponse, LoginRequest, RefreshResponse, RegisterRequest } from '../model/types';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/signUp', method: 'POST', body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => '/auth/logout',
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => '/auth/refresh',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useRefreshMutation } =
  authApi;
