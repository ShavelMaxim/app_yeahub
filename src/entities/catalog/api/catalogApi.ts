import { baseApi, type PaginatedResponse } from '@/shared/api';
import type { EntityPayload, Skill, Specialization } from '../model/types';

const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecializations: builder.query<
      PaginatedResponse<Specialization>,
      { page?: number; limit?: number }
    >({
      query: (params) => ({ url: '/specializations', params }),
      providesTags: (result) => [
        'Specialization',
        ...(result?.data.map(({ id }) => ({ type: 'Specialization' as const, id })) ?? []),
      ],
    }),
    createSpecialization: builder.mutation<Specialization, EntityPayload>({
      query: (body) => ({ url: '/specializations', method: 'POST', body }),
      invalidatesTags: ['Specialization'],
    }),
    updateSpecialization: builder.mutation<Specialization, { id: number; body: EntityPayload }>({
      query: ({ id, body }) => ({ url: `/specializations/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Specialization', id }],
    }),
    deleteSpecialization: builder.mutation<void, number>({
      query: (id) => ({ url: `/specializations/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Specialization'],
    }),
    getSkills: builder.query<
      PaginatedResponse<Skill>,
      { page?: number; limit?: number; title?: string }
    >({
      query: (params) => ({ url: '/skills', params }),
      providesTags: (result) => [
        'Skill',
        ...(result?.data.map(({ id }) => ({ type: 'Skill' as const, id })) ?? []),
      ],
    }),
    createSkill: builder.mutation<Skill, EntityPayload>({
      query: (body) => ({ url: '/skills', method: 'POST', body }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: builder.mutation<Skill, { id: number; body: EntityPayload }>({
      query: ({ id, body }) => ({ url: `/skills/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Skill', id }],
    }),
    deleteSkill: builder.mutation<void, number>({
      query: (id) => ({ url: `/skills/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Skill'],
    }),
  }),
});

export const {
  useGetSpecializationsQuery,
  useCreateSpecializationMutation,
  useUpdateSpecializationMutation,
  useDeleteSpecializationMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = catalogApi;
