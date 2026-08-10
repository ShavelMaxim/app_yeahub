import { baseApi, type PaginatedResponse } from '@/shared/api';
import type { Question } from '../model/types';

const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicQuestions: builder.query<
      PaginatedResponse<Question>,
      { page?: number; limit?: number }
    >({
      query: (params) => ({ url: '/questions/public-questions', params }),
    }),
  }),
});

export const { useGetPublicQuestionsQuery } = questionApi;
