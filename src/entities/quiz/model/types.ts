import type { Question } from '@/entities/question';

export type QuizMode = 'repeat' | 'new' | 'random';

export interface QuizSettings {
  specializationId?: number;
  skills: number[];
  complexity: number[];
  mode: QuizMode;
  limit: number;
}

export type MockQuizResponse =
  | Question[]
  | {
      data?: Question[];
      questions?: Question[];
      items?: Array<Question | { question?: Question }>;
    };
