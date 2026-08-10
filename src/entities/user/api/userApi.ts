import { baseApi } from '@/shared/api';
import type { Profile, User } from '../model/types';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['Me'],
    }),
    updateUser: builder.mutation<User, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    updateProfile: builder.mutation<
      Profile,
      {
        id: string;
        body: Partial<Omit<Profile, 'profileSkills'>> & { profileSkills?: string[] };
      }
    >({
      query: ({ id, body }) => ({ url: `/profiles/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Me', 'Profile'],
    }),
  }),
});

export const { useGetMeQuery, useUpdateUserMutation, useUpdateProfileMutation } = userApi;
