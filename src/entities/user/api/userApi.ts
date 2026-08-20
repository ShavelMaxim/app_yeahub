import { baseApi } from '@/shared/api';
import type { Profile, User } from '../model/types';
import type { UpdateProfileRequest, UpdateUserRequest } from '../model/profileUpdate';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['Me'],
    }),
    updateUser: builder.mutation<User, { id: string; body: UpdateUserRequest }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PATCH', body }),
    }),
    createProfile: builder.mutation<
      void,
      {
        userId: string;
        profileType: number;
        specializationId: number;
        markingWeight: number;
      }
    >({
      query: (body) => ({ url: '/profiles', method: 'POST', body }),
    }),
    setActiveProfile: builder.mutation<void, string>({
      query: (profileId) => ({ url: `/profiles/${profileId}/active`, method: 'PATCH' }),
    }),
    updateProfile: builder.mutation<
      Profile,
      {
        id: string;
        body: UpdateProfileRequest;
      }
    >({
      query: ({ id, body }) => ({ url: `/profiles/${id}`, method: 'PUT', body }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useCreateProfileMutation,
  useSetActiveProfileMutation,
  useUpdateUserMutation,
  useUpdateProfileMutation,
} = userApi;
