import { useState } from 'react';
import { Card, EmptyState, Skeleton } from '@/shared/ui';
import { useGetPublicQuestionsQuery } from '@/entities/question';

export default function QuestionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetPublicQuestionsQuery({ page, limit: 12 });

  return (
    <section className="page-section questions-page">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">База знаний</span>
          <h1>Вопросы с IT-собеседований</h1>
          <p>Проверяй себя и разбирай сложные темы в удобном темпе.</p>
        </div>
        {isLoading ? (
          <div className="questions-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i}>
                <Skeleton />
              </Card>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon="!"
            title="Не удалось загрузить вопросы"
            description="Проверьте соединение и попробуйте обновить страницу."
          />
        ) : !data?.data.length ? (
          <EmptyState
            title="Вопросы не найдены"
            description="В этом разделе пока нет опубликованных вопросов."
          />
        ) : (
          <>
            <div className="questions-grid">
              {data.data.map((question) => (
                <Card key={question.id} interactive className="catalog-question">
                  <div>
                    <span className="tag tag--purple">
                      {question.questionSkills?.[0]?.title ?? 'IT'}
                    </span>
                    <span className="complexity">
                      Сложность {question.complexity ?? question.rate ?? '—'}
                    </span>
                  </div>
                  <h2>{question.title}</h2>
                  <p>{question.description || 'Открой вопрос, чтобы проверить свои знания.'}</p>
                </Card>
              ))}
            </div>
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                ← Назад
              </button>
              <span>Страница {page}</span>
              <button
                disabled={page * 12 >= data.total}
                onClick={() => setPage((current) => current + 1)}
              >
                Вперёд →
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
