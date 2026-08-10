import { baseApi } from '@/shared/api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../model/types';

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
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
