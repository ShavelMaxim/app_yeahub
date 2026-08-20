import { Link } from 'react-router-dom';
import { difficultyRanges, useInterviewSettings } from '@/features/interview/configure-interview';
import { Button, EmptyState, Skeleton } from '@/shared/ui';
import styles from './TrainerPage.module.css';

export default function TrainerPage() {
  const {
    availableSkills,
    chooseSpecialization,
    difficulty,
    error,
    isCatalogError,
    isLoadingSkills,
    isLoadingSpecializations,
    isStarting,
    limit,
    mode,
    setDifficulty,
    setLimit,
    setMode,
    skillIds,
    specializations,
    specializationId,
    start,
    toggleSkill,
  } = useInterviewSettings();

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
                {isLoadingSpecializations ? (
                  <Skeleton className={styles.chipSkeleton} lines={3} />
                ) : (
                  specializations.map((item) => (
                    <button
                      className={specializationId === item.id ? styles.selected : ''}
                      type="button"
                      key={item.id}
                      onClick={() => chooseSpecialization(item.id)}
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
                {isLoadingSkills ? (
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
        {isCatalogError && (
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
        <Button className={styles.startButton} loading={isStarting} onClick={start}>
          Начать <span aria-hidden="true">→</span>
        </Button>
      </div>
    </section>
  );
}
