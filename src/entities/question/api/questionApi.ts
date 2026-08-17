import { baseApi, type PaginatedResponse } from '@/shared/api';
import type { Question } from '../model/types';

export interface PublicQuestionsParams {
  page?: number;
  limit?: number;
  title?: string;
  skills?: number[];
  specializationId?: number;
  complexity?: number[];
  rate?: number;
}

const createQuestionsUrl = (params: PublicQuestionsParams) => {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.title) search.set('title', params.title);
  if (params.specializationId) search.set('specializationId', String(params.specializationId));
  if (params.rate) search.set('rate', String(params.rate));
  params.skills?.forEach((skill) => search.append('skills', String(skill)));
  params.complexity?.forEach((value) => search.append('complexity', String(value)));
  return `/questions/public-questions?${search.toString()}`;
};

const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicQuestions: builder.query<PaginatedResponse<Question>, PublicQuestionsParams>({
      query: createQuestionsUrl,
    }),
    getPublicQuestionById: builder.query<Question, string | number>({
      query: (id) => `/questions/public-questions/${id}`,
    }),
  }),
});

export const {
  useGetPublicQuestionsQuery,
  useLazyGetPublicQuestionsQuery,
  useGetPublicQuestionByIdQuery,
} = questionApi;
