import { baseApi } from '@/shared/api';
import type { MockQuizResponse, QuizSettings } from '../model/types';

const createMockQuizUrl = (settings: QuizSettings) => {
  const params = new URLSearchParams();
  if (settings.specializationId) params.set('specializationId', String(settings.specializationId));
  params.set('limit', String(settings.limit));
  params.set('mode', settings.mode);
  settings.skills.forEach((id) => params.append('skills', String(id)));
  settings.complexity.forEach((value) => params.append('complexity', String(value)));
  return `/interview-preparation/quizzes/mock?${params.toString()}`;
};

const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewMockQuiz: builder.query<MockQuizResponse, QuizSettings>({ query: createMockQuizUrl }),
  }),
});

export const { useLazyGetNewMockQuizQuery } = quizApi;
