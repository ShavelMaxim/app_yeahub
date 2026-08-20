import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSkillsQuery, useGetSpecializationsQuery } from '@/entities/catalog';
import { useLazyGetPublicQuestionsQuery, type Question } from '@/entities/question';
import { useLazyGetNewMockQuizQuery, type MockQuizResponse, type QuizMode } from '@/entities/quiz';
import { getApiErrorMessage } from '@/shared/lib';

export type DifficultyRange = '1-3' | '4-6' | '7-8' | '9-10';
export const difficultyRanges: DifficultyRange[] = ['1-3', '4-6', '7-8', '9-10'];

const rangeToValues = (range: DifficultyRange) => {
  const [from, to] = range.split('-').map(Number);
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
};

const extractQuestions = (response: MockQuizResponse): Question[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.questions)) return response.questions;
  if (Array.isArray(response.items)) {
    return response.items
      .map((item) => ('question' in item ? item.question : item))
      .filter((item): item is Question => Boolean(item));
  }
  return [];
};

export const useInterviewSettings = () => {
  const navigate = useNavigate();
  const [specializationId, setSpecializationId] = useState<number | undefined>();
  const [skillIds, setSkillIds] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyRange>('9-10');
  const [mode, setMode] = useState<QuizMode>('new');
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState('');
  const specializations = useGetSpecializationsQuery({ page: 1, limit: 100 });
  const skills = useGetSkillsQuery({ page: 1, limit: 100 });
  const [getQuiz, quizState] = useLazyGetNewMockQuizQuery();
  const [getFallback, fallbackState] = useLazyGetPublicQuestionsQuery();

  const availableSkills = useMemo(() => {
    const items = skills.data?.data ?? [];
    if (!specializationId) return items;
    return items.filter((skill) =>
      skill.specializations?.some((item) =>
        typeof item === 'number' ? item === specializationId : item.id === specializationId,
      ),
    );
  }, [skills.data?.data, specializationId]);

  const chooseSpecialization = (id: number) => {
    setSpecializationId((current) => (current === id ? undefined : id));
    setSkillIds([]);
  };

  const toggleSkill = (id: number) => {
    setSkillIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const start = async () => {
    setError('');
    const settings = {
      specializationId,
      skills: skillIds,
      complexity: rangeToValues(difficulty),
      mode,
      limit,
    };

    try {
      const response = await getQuiz(settings).unwrap();
      const questions = extractQuestions(response);
      if (!questions.length) throw new Error('В созданном квизе нет вопросов');
      navigate('/trainer/quiz', { state: { questions, settings } });
    } catch (requestError) {
      try {
        const fallback = await getFallback({
          page: 1,
          limit,
          skills: skillIds.length ? skillIds : undefined,
          specializationId,
          complexity: rangeToValues(difficulty),
        }).unwrap();
        if (!fallback.data.length) throw new Error('Вопросы по выбранным параметрам не найдены');
        navigate('/trainer/quiz', {
          state: { questions: fallback.data, settings, fallback: true },
        });
      } catch {
        setError(getApiErrorMessage(requestError));
      }
    }
  };

  return {
    availableSkills,
    chooseSpecialization,
    difficulty,
    error,
    isCatalogError: specializations.isError || skills.isError,
    isLoadingSkills: skills.isLoading,
    isLoadingSpecializations: specializations.isLoading,
    isStarting: quizState.isFetching || fallbackState.isFetching,
    limit,
    mode,
    setDifficulty,
    setLimit,
    setMode,
    skillIds,
    specializations: specializations.data?.data ?? [],
    specializationId,
    start,
    toggleSkill,
  };
};
