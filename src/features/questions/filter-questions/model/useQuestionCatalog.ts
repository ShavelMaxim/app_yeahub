import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetSkillsQuery, useGetSpecializationsQuery } from '@/entities/catalog';
import { useGetPublicQuestionsQuery } from '@/entities/question';

export type DifficultyRange = '1-3' | '4-6' | '7-8' | '9-10';

export const difficultyRanges: DifficultyRange[] = ['1-3', '4-6', '7-8', '9-10'];
export const ratings = [1, 2, 3, 4, 5];

const parseNumber = (value: string | null) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
};

const parseIds = (value: string | null) =>
  value
    ?.split(',')
    .map(Number)
    .filter((id) => Number.isFinite(id) && id > 0) ?? [];

const rangeToValues = (range: string | null) => {
  if (!range || !/^\d+-\d+$/.test(range)) return undefined;
  const [from, to] = range.split('-').map(Number);
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
};

export const useQuestionCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseNumber(searchParams.get('page')) ?? 1;
  const title = searchParams.get('title') ?? '';
  const specializationId = parseNumber(searchParams.get('specializationId'));
  const selectedSkills = useMemo(() => parseIds(searchParams.get('skills')), [searchParams]);
  const difficulty = searchParams.get('difficulty') as DifficultyRange | null;
  const rating = parseNumber(searchParams.get('rate'));
  const [searchDraft, setSearchDraft] = useState(title);
  const [openQuestionId, setOpenQuestionId] = useState<string | number | null>(null);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);
  const initializedOpenQuestion = useRef(false);

  const { data, isLoading, isError, refetch } = useGetPublicQuestionsQuery({
    page,
    limit: 10,
    title: title || undefined,
    skills: selectedSkills.length ? selectedSkills : undefined,
    specializationId,
    complexity: rangeToValues(difficulty),
    rate: rating,
  });
  const specializations = useGetSpecializationsQuery({ page: 1, limit: 100 });
  const skills = useGetSkillsQuery({ page: 1, limit: 100 });
  const questions = useMemo(() => data?.data ?? [], [data?.data]);
  const specializationItems = specializations.data?.data ?? [];
  const skillItems = skills.data?.data ?? [];

  useEffect(() => setSearchDraft(title), [title]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchDraft === title) return;
      const next = new URLSearchParams(searchParams);
      if (searchDraft.trim()) next.set('title', searchDraft.trim());
      else next.delete('title');
      next.set('page', '1');
      setSearchParams(next, { replace: true });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [searchDraft, searchParams, setSearchParams, title]);

  useEffect(() => {
    if (!initializedOpenQuestion.current && questions.length) {
      setOpenQuestionId(questions[0].id);
      initializedOpenQuestion.current = true;
    }
  }, [questions]);

  const setFilter = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const toggleSkill = (id: number) => {
    const next = selectedSkills.includes(id)
      ? selectedSkills.filter((skillId) => skillId !== id)
      : [...selectedSkills, id];
    setFilter('skills', next.length ? next.join(',') : undefined);
  };

  const changePage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
    initializedOpenQuestion.current = false;
    setOpenQuestionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedSkillTitles = skillItems
    .filter((skill) => selectedSkills.includes(skill.id))
    .map((skill) => skill.title);

  return {
    changePage,
    data,
    difficulty,
    isError,
    isLoading,
    openQuestionId,
    page,
    questions,
    rating,
    refetch,
    searchDraft,
    selectedSkills,
    setFilter,
    setOpenQuestionId,
    setSearchDraft,
    setSearchParams,
    setShowAllSkills,
    setShowAllSpecializations,
    showAllSkills,
    showAllSpecializations,
    skillItems,
    specializationId,
    specializationItems,
    titleSuffix: selectedSkillTitles.length ? ` ${selectedSkillTitles.join(', ')}` : '',
    toggleSkill,
  };
};
