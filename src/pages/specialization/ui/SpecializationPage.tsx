import { Link, useParams } from 'react-router-dom';
import { useGetSpecializationByIdQuery } from '@/entities/catalog';
import { Card, EmptyState, Skeleton } from '@/shared/ui';
import styles from './SpecializationPage.module.css';

export default function SpecializationPage() {
  const id = Number(useParams().specializationId);
  const query = useGetSpecializationByIdQuery(id, { skip: !Number.isFinite(id) || id < 1 });

  if (!Number.isFinite(id) || id < 1) {
    return (
      <EmptyState title="Некорректный идентификатор" description="Проверьте адрес специализации." />
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.back} to="/admin">
          ← К списку специализаций
        </Link>
        {query.isLoading ? (
          <Skeleton lines={7} />
        ) : query.isError || !query.data ? (
          <EmptyState
            icon="!"
            title="Специализация не найдена"
            description="Запись могла быть удалена или API временно недоступно."
          />
        ) : (
          <Card className={styles.card}>
            <div className={styles.id}>Специализация #{query.data.id}</div>
            <h1>{query.data.title}</h1>
            <p>{query.data.description || 'Описание пока не добавлено.'}</p>
            {query.data.imageSrc && <img src={query.data.imageSrc} alt="" />}
            <div className={styles.actions}>
              <Link to={`/admin/specializations/${query.data.id}/edit`}>Редактировать</Link>
              <Link to="/admin">Вернуться к управлению</Link>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
