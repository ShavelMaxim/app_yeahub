import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetSkillsQuery, useGetSpecializationsQuery } from '@/entities/catalog';
import { useLazyGetPublicQuestionsQuery } from '@/entities/question';
import type { Question } from '@/entities/question';
import { useLazyGetNewMockQuizQuery, type MockQuizResponse, type QuizMode } from '@/entities/quiz';
import { Button, EmptyState, Skeleton } from '@/shared/ui';
import { getApiErrorMessage } from '@/shared/lib';
import styles from './TrainerPage.module.css';

type DifficultyRange = '1-3' | '4-6' | '7-8' | '9-10';
const difficultyRanges: DifficultyRange[] = ['1-3', '4-6', '7-8', '9-10'];

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

export default function TrainerPage() {
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

  return (
    <section className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link to="/">Главная</Link>
        <span aria-hidden="true">›</span>
        <span>Тренажёр</span>
      </nav>
      <div className={styles.setupCard}>
        <h1>Собеседование</h1>
        <div className={styles.setupGrid}>
          <div>
            <fieldset className={styles.fieldset}>
              <legend>Специализация</legend>
              <div className={styles.chips}>
                {specializations.isLoading ? (
                  <Skeleton className={styles.chipSkeleton} lines={3} />
                ) : (
                  (specializations.data?.data ?? []).map((item) => (
                    <button
                      className={specializationId === item.id ? styles.selected : ''}
                      type="button"
                      key={item.id}
                      onClick={() => {
                        setSpecializationId((current) =>
                          current === item.id ? undefined : item.id,
                        );
                        setSkillIds([]);
                      }}
                    >
                      {item.title}
                    </button>
                  ))
                )}
              </div>
            </fieldset>
            <fieldset className={styles.fieldset}>
              <legend>Категории вопросов</legend>
              <div className={styles.chips}>
                {skills.isLoading ? (
                  <Skeleton className={styles.chipSkeleton} lines={4} />
                ) : (
                  availableSkills.map((skill) => (
                    <button
                      className={skillIds.includes(skill.id) ? styles.selected : ''}
                      type="button"
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                    >
                      {skill.imageSrc && <img src={skill.imageSrc} alt="" aria-hidden="true" />}
                      {skill.title}
                    </button>
                  ))
                )}
              </div>
            </fieldset>
          </div>

          <div className={styles.settings}>
            <fieldset className={styles.fieldset}>
              <legend>Уровень сложности</legend>
              <div className={styles.chips}>
                {difficultyRanges.map((range) => (
                  <button
                    className={difficulty === range ? styles.selected : ''}
                    type="button"
                    key={range}
                    onClick={() => setDifficulty(range)}
                  >
                    {range.replace('-', '–')}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className={styles.fieldset}>
              <legend>Выберите режим</legend>
              <div className={styles.chips}>
                <button
                  className={mode === 'repeat' ? styles.selected : ''}
                  type="button"
                  onClick={() => setMode('repeat')}
                >
                  Повторение
                </button>
                <button
                  className={mode === 'new' ? styles.selected : ''}
                  type="button"
                  onClick={() => setMode('new')}
                >
                  Только новые
                </button>
                <button
                  className={mode === 'random' ? styles.selected : ''}
                  type="button"
                  onClick={() => setMode('random')}
                >
                  Случайные
                </button>
              </div>
            </fieldset>
            <fieldset className={styles.fieldset}>
              <legend>Количество вопросов</legend>
              <div className={styles.counter}>
                <button type="button" onClick={() => setLimit((value) => Math.max(5, value - 5))}>
                  −
                </button>
                <span>{limit}</span>
                <button type="button" onClick={() => setLimit((value) => Math.min(50, value + 5))}>
                  +
                </button>
              </div>
            </fieldset>
          </div>
        </div>
        {(specializations.isError || skills.isError) && (
          <EmptyState
            className={styles.catalogError}
            icon="!"
            title="Не удалось загрузить часть настроек"
            description="Повторите попытку позже или запустите тренажёр с параметрами по умолчанию."
          />
        )}
        {error && (
          <div className={styles.requestError} role="alert">
            {error}
          </div>
        )}
        <Button
          className={styles.startButton}
          loading={quizState.isFetching || fallbackState.isFetching}
          onClick={start}
        >
          Начать <span aria-hidden="true">→</span>
        </Button>
      </div>
    </section>
  );
}
