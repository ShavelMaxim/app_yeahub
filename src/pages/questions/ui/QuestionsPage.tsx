import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuestionAccordion, useGetPublicQuestionsQuery } from '@/entities/question';
import { useGetSkillsQuery, useGetSpecializationsQuery } from '@/entities/catalog';
import { EmptyState, Pagination, Skeleton } from '@/shared/ui';
import searchIcon from '@/shared/config/assets/icons/search.svg';
import styles from './QuestionsPage.module.css';

type DifficultyRange = '1-3' | '4-6' | '7-8' | '9-10';

const difficultyRanges: DifficultyRange[] = ['1-3', '4-6', '7-8', '9-10'];
const ratings = [1, 2, 3, 4, 5];

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

export default function QuestionsPage() {
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

  useEffect(() => {
    setSearchDraft(title);
  }, [title]);

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
  const titleSuffix = selectedSkillTitles.length ? ` ${selectedSkillTitles.join(', ')}` : '';

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.questionsPanel}>
          <h1>Вопросы{titleSuffix}</h1>

          {isLoading ? (
            <div className={styles.list} aria-label="Загрузка вопросов">
              {Array.from({ length: 8 }, (_, index) => (
                <div className={styles.skeleton} key={index}>
                  <Skeleton lines={1} />
                </div>
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon="!"
              title="Не удалось загрузить вопросы"
              description="Проверьте соединение и повторите запрос."
              action={
                <button className={styles.retry} type="button" onClick={() => refetch()}>
                  Повторить
                </button>
              }
            />
          ) : !questions.length ? (
            <EmptyState
              title="Вопросы не найдены"
              description="Измените поисковый запрос или сбросьте фильтры."
              action={
                <button
                  className={styles.retry}
                  type="button"
                  onClick={() => setSearchParams({ page: '1' })}
                >
                  Сбросить фильтры
                </button>
              }
            />
          ) : (
            <>
              <div className={styles.list}>
                {questions.map((question) => (
                  <QuestionAccordion
                    key={question.id}
                    question={question}
                    isOpen={openQuestionId === question.id}
                    onToggle={() =>
                      setOpenQuestionId((current) => (current === question.id ? null : question.id))
                    }
                  />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={Math.max(1, Math.ceil((data?.total ?? 0) / 10))}
                onPageChange={changePage}
              />
            </>
          )}
        </div>

        <aside className={styles.filters} aria-label="Фильтры вопросов">
          <label className={styles.search}>
            <span className={styles.visuallyHidden}>Найти вопрос</span>
            <img src={searchIcon} alt="" aria-hidden="true" />
            <input
              type="search"
              value={searchDraft}
              placeholder="Введите запрос..."
              onChange={(event) => setSearchDraft(event.target.value)}
            />
          </label>

          <div className={styles.filterGroup}>
            <h2>Специализация</h2>
            <div className={styles.chips}>
              {(showAllSpecializations ? specializationItems : specializationItems.slice(0, 5)).map(
                (item) => (
                  <button
                    className={specializationId === item.id ? styles.selected : ''}
                    type="button"
                    key={item.id}
                    aria-pressed={specializationId === item.id}
                    onClick={() =>
                      setFilter(
                        'specializationId',
                        specializationId === item.id ? undefined : String(item.id),
                      )
                    }
                  >
                    {item.title}
                  </button>
                ),
              )}
            </div>
            {specializationItems.length > 5 && (
              <button
                className={styles.showAll}
                type="button"
                onClick={() => setShowAllSpecializations((value) => !value)}
              >
                {showAllSpecializations ? 'Скрыть' : 'Посмотреть все'}
              </button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <h2>Навыки</h2>
            <div className={styles.chips}>
              {(showAllSkills ? skillItems : skillItems.slice(0, 8)).map((skill) => (
                <button
                  className={selectedSkills.includes(skill.id) ? styles.selected : ''}
                  type="button"
                  key={skill.id}
                  aria-pressed={selectedSkills.includes(skill.id)}
                  onClick={() => toggleSkill(skill.id)}
                >
                  {skill.imageSrc && <img src={skill.imageSrc} alt="" aria-hidden="true" />}
                  {skill.title}
                </button>
              ))}
            </div>
            {skillItems.length > 8 && (
              <button
                className={styles.showAll}
                type="button"
                onClick={() => setShowAllSkills((value) => !value)}
              >
                {showAllSkills ? 'Скрыть' : 'Посмотреть все'}
              </button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <h2>Уровень сложности</h2>
            <div className={styles.chips}>
              {difficultyRanges.map((range) => (
                <button
                  className={difficulty === range ? styles.selected : ''}
                  type="button"
                  key={range}
                  aria-pressed={difficulty === range}
                  onClick={() => setFilter('difficulty', difficulty === range ? undefined : range)}
                >
                  {range.replace('-', '–')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h2>Рейтинг</h2>
            <div className={styles.chips}>
              {ratings.map((value) => (
                <button
                  className={rating === value ? styles.selected : ''}
                  type="button"
                  key={value}
                  aria-pressed={rating === value}
                  onClick={() => setFilter('rate', rating === value ? undefined : String(value))}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
