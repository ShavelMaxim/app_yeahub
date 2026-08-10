import { useState } from 'react';
import { Button, Card, EmptyState, Skeleton } from '@/shared/ui';
import { useGetPublicQuestionsQuery } from '@/entities/question';

export default function TrainerPage() {
  const { data, isLoading, isError } = useGetPublicQuestionsQuery({ page: 1, limit: 5 });
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const questions = data?.data ?? [];
  const question = questions[index];

  const answer = (didKnow: boolean) => {
    if (didKnow) setKnown((value) => value + 1);
    setRevealed(false);
    setIndex((value) => value + 1);
  };

  if (isLoading)
    return (
      <section className="page-section container container--narrow">
        <Skeleton lines={7} />
      </section>
    );
  if (isError || !questions.length)
    return (
      <section className="page-section container">
        <EmptyState
          icon="!"
          title="Тренировка пока недоступна"
          description="Не удалось получить вопросы от API. Попробуйте позже."
        />
      </section>
    );
  if (index >= questions.length)
    return (
      <section className="page-section container container--narrow">
        <Card className="trainer-result">
          <span className="trainer-result__icon">🏁</span>
          <h1>Тренировка завершена</h1>
          <p>
            Уверенных ответов:{' '}
            <strong>
              {known} из {questions.length}
            </strong>
          </p>
          <Button
            onClick={() => {
              setIndex(0);
              setKnown(0);
            }}
          >
            Пройти ещё раз
          </Button>
        </Card>
      </section>
    );

  return (
    <section className="page-section trainer-page">
      <div className="container container--narrow">
        <div className="trainer-progress">
          <span>
            Вопрос {index + 1} из {questions.length}
          </span>
          <div className="progress">
            <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <Card className="trainer-card">
          <div className="question-card__top">
            <span className="tag tag--purple">{question.questionSkills?.[0]?.title ?? 'IT'}</span>
            <span>Сложность {question.complexity ?? question.rate ?? '—'}</span>
          </div>
          <h1>{question.title}</h1>
          {question.description && <p>{question.description}</p>}
          {revealed ? (
            <div className="answer">
              <h2>Ответ</h2>
              <p>
                {question.longAnswer ||
                  question.shortAnswer ||
                  'Ответ будет добавлен редакторами YeaHub.'}
              </p>
            </div>
          ) : (
            <Button size="large" onClick={() => setRevealed(true)}>
              Показать ответ
            </Button>
          )}
          {revealed && (
            <div className="trainer-actions">
              <Button variant="secondary" onClick={() => answer(false)}>
                Нужно повторить
              </Button>
              <Button onClick={() => answer(true)}>Знаю ответ</Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
