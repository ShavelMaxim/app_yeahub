import { Link } from 'react-router-dom';
import { useGetSpecializationsQuery } from '@/entities/catalog';
import { useGetMeQuery } from '@/entities/user';
import type { Profile } from '@/entities/user';
import { useAuth } from '@/features/auth';
import { EmptyState, Skeleton } from '@/shared/ui';
import styles from './ProfileViewPage.module.css';

export default function ProfileViewPage() {
  const { user: cachedUser } = useAuth();
  const { data, isLoading, isError, refetch } = useGetMeQuery();
  const user = data ?? cachedUser;
  const profile = user?.profiles?.find((item: Profile) => item.isActive) ?? user?.profiles?.[0];
  const specializations = useGetSpecializationsQuery({ page: 1, limit: 100 });
  const specialization = specializations.data?.data.find(
    (item) => item.id === profile?.specializationId,
  );

  if (isLoading && !user)
    return (
      <section className={styles.state}>
        <Skeleton lines={8} />
      </section>
    );
  if (isError || !user) {
    return (
      <section className={styles.state}>
        <EmptyState
          icon="!"
          title="Профиль не загрузился"
          description="Повторите запрос или войдите заново."
          action={
            <button type="button" onClick={() => refetch()}>
              Повторить
            </button>
          }
        />
      </section>
    );
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.titleRow}>
          <div>
            <span>Мой профиль</span>
            <h1>{displayName}</h1>
          </div>
          <Link className={styles.edit} to="/profile/edit">
            Редактировать
          </Link>
        </div>

        <article className={styles.profileCard}>
          <div className={styles.avatar}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" />
            ) : (
              <span>{displayName[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className={styles.mainInfo}>
            <h2>{displayName}</h2>
            <p>{specialization?.title ?? 'Специализация не выбрана'}</p>
            <div>
              <span>{user.email}</span>
              {user.city && <span>{user.city}</span>}
            </div>
          </div>
          <span className={styles.status}>
            {user.isVerified ? 'Профиль подтверждён' : 'Профиль заполняется'}
          </span>
        </article>

        <div className={styles.contentGrid}>
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeading}>
              <h2>Обо мне</h2>
              <Link to="/profile/edit">Редактировать</Link>
            </div>
            <p>
              {profile?.description ||
                'Добавьте информацию о себе, опыте и профессиональных целях.'}
            </p>
          </article>
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeading}>
              <h2>Навыки</h2>
              <Link to="/profile/edit">Редактировать</Link>
            </div>
            <div className={styles.skills}>
              {profile?.profileSkills?.length ? (
                profile.profileSkills.map((skill) => <span key={skill.id}>{skill.title}</span>)
              ) : (
                <p>Навыки пока не выбраны.</p>
              )}
            </div>
          </article>
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeading}>
              <h2>Контакты</h2>
              <Link to="/profile/edit">Редактировать</Link>
            </div>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Город</dt>
                <dd>{user.city || 'Не указан'}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
