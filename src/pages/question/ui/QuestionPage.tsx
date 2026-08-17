import { Link, useParams } from 'react-router-dom';
import { RichTextContent, useGetPublicQuestionByIdQuery } from '@/entities/question';
import { EmptyState, Skeleton } from '@/shared/ui';
import styles from './QuestionPage.module.css';

export default function QuestionPage() {
  const { questionId } = useParams();
  const {
    data: question,
    isLoading,
    isError,
    refetch,
  } = useGetPublicQuestionByIdQuery(questionId ?? '', { skip: !questionId });

  if (isLoading) {
    return (
      <section className={styles.state}>
        <Skeleton lines={8} />
      </section>
    );
  }

  if (isError || !question) {
    return (
      <section className={styles.state}>
        <EmptyState
          icon="!"
          title="Вопрос не найден"
          description="Возможно, вопрос был удалён или временно недоступен."
          action={
            <button type="button" onClick={() => refetch()}>
              Повторить запрос
            </button>
          }
        />
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Link className={styles.back} to="/questions" aria-label="Вернуться к списку вопросов">
        <span aria-hidden="true">‹</span> Назад
      </Link>
      <div className={styles.layout}>
        <div className={styles.content}>
          <article className={styles.questionCard}>
            {question.imageSrc && <img src={question.imageSrc} alt="" />}
            <div>
              <h1>{question.title}</h1>
              {question.description && <p>{question.description}</p>}
            </div>
          </article>

          <article className={styles.answerCard}>
            <h2>Краткий ответ</h2>
            <RichTextContent html={question.shortAnswer || 'Краткий ответ пока не добавлен.'} />
          </article>

          <article className={styles.answerCard}>
            <h2>Развёрнутый ответ</h2>
            <RichTextContent
              html={question.longAnswer || question.shortAnswer || 'Ответ пока не добавлен.'}
            />
          </article>
        </div>

        <aside className={styles.meta}>
          <h2>Уровень:</h2>
          <div className={styles.levels}>
            <span>
              Сложность: <b>{question.complexity ?? '—'}</b>
            </span>
            <span>
              Рейтинг: <b>{question.rate ?? '—'}</b>
            </span>
          </div>
          {!!question.questionSpecializations?.length && (
            <div className={styles.metaGroup}>
              <h3>Специализация:</h3>
              <div>
                {question.questionSpecializations.map((item) => (
                  <span key={item.id}>{item.title}</span>
                ))}
              </div>
            </div>
          )}
          {!!question.questionSkills?.length && (
            <div className={styles.metaGroup}>
              <h3>Навыки:</h3>
              <div>
                {question.questionSkills.map((item) => (
                  <span key={item.id}>{item.title}</span>
                ))}
              </div>
            </div>
          )}
          {!!question.keywords?.length && (
            <div className={styles.keywords}>
              <h3>Ключевые слова:</h3>
              <div>
                {question.keywords.map((word) => (
                  <span key={word}>#{word}</span>
                ))}
              </div>
            </div>
          )}
          {question.createdBy?.username && (
            <p className={styles.author}>
              Автор: <b>{question.createdBy.username}</b>
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
