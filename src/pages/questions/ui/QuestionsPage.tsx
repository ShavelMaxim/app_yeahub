import { QuestionAccordion } from '@/entities/question';
import { difficultyRanges, ratings, useQuestionCatalog } from '@/features/questions/filter-questions';
import { EmptyState, Pagination, Skeleton } from '@/shared/ui';
import searchIcon from '@/shared/config/assets/icons/search.svg';
import styles from './QuestionsPage.module.css';

export default function QuestionsPage() {
  const {
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
    titleSuffix,
    toggleSkill,
  } = useQuestionCatalog();

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
