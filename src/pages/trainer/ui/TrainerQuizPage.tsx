import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { Question } from '@/entities/question';
import { RichTextContent } from '@/entities/question';
import { Button } from '@/shared/ui';
import styles from './TrainerQuizPage.module.css';

interface QuizLocationState {
  questions?: Question[];
  fallback?: boolean;
}

export default function TrainerQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as QuizLocationState | null;
  const questions = state?.questions ?? [];
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!questions.length) return <Navigate to="/trainer" replace />;

  const question = questions[index];
  const answer = (didKnow: boolean) => {
    if (didKnow) setKnown((value) => value + 1);
    if (index + 1 >= questions.length) setCompleted(true);
    else {
      setIndex((value) => value + 1);
      setRevealed(false);
    }
  };

  if (completed) {
    const percent = Math.round((known / questions.length) * 100);
    return (
      <section className={styles.resultPage}>
        <div className={styles.resultCard}>
          <span>{percent}%</span>
          <h1>Тренировка завершена</h1>
          <p>
            Уверенных ответов:{' '}
            <strong>
              {known} из {questions.length}
            </strong>
          </p>
          <div>
            <Button variant="secondary" onClick={() => navigate('/trainer')}>
              Изменить настройки
            </Button>
            <Button
              onClick={() => {
                setIndex(0);
                setKnown(0);
                setRevealed(false);
                setCompleted(false);
              }}
            >
              Пройти ещё раз
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Link className={styles.back} to="/trainer">
        ‹ Назад к настройкам
      </Link>
      {state?.fallback && (
        <p className={styles.demoNotice}>
          Использован публичный набор вопросов: персональный квиз доступен после авторизации.
        </p>
      )}
      <div className={styles.progressRow}>
        <span>
          Вопрос {index + 1} из {questions.length}
        </span>
        <div>
          <i style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
      <article className={styles.quizCard}>
        <div className={styles.meta}>
          <span>{question.questionSkills?.[0]?.title ?? 'IT'}</span>
          <span>Сложность: {question.complexity ?? '—'}</span>
        </div>
        <h1>{question.title}</h1>
        {question.description && <p>{question.description}</p>}
        {!revealed ? (
          <Button size="large" onClick={() => setRevealed(true)}>
            Показать ответ
          </Button>
        ) : (
          <>
            <div className={styles.answer}>
              <h2>Ответ</h2>
              <RichTextContent
                html={question.shortAnswer || question.longAnswer || 'Ответ пока не добавлен.'}
              />
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => answer(false)}>
                Нужно повторить
              </Button>
              <Button onClick={() => answer(true)}>Знаю ответ</Button>
            </div>
          </>
        )}
      </article>
    </section>
  );
}
