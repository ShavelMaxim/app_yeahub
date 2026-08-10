import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ApiErrorBody } from '@/shared/api';

const messages: Record<string, string> = {
  'auth.auth.public_unauthorized': 'Неверный email или пароль.',
  'user.user.conflict': 'Пользователь с такими данными уже существует.',
  'specialization.specialization.title.conflict': 'Такая специализация уже существует.',
  'skill.skill.title.conflict': 'Такой навык уже существует.',
};

export const getApiErrorMessage = (error: unknown): string => {
  const fallback = 'Не удалось выполнить запрос. Попробуйте ещё раз.';
  if (!error || typeof error !== 'object' || !('status' in error)) return fallback;
  const { data } = error as FetchBaseQueryError;
  if (!data || typeof data !== 'object') return fallback;
  const body = data as ApiErrorBody;
  const code = Array.isArray(body.message) ? body.message[0] : body.message;
  return (code && messages[code]) || body.description || code || fallback;
};
