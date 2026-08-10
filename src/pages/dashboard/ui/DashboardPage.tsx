import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Card, Skeleton } from '@/shared/ui';
import { useGetMeQuery, type Profile } from '@/entities/user';

const activities = [
  { icon: '◎', title: 'Вопросы изучены', value: '0', meta: 'Начни сегодня' },
  { icon: '✓', title: 'Тренировки', value: '0', meta: 'Первый шаг впереди' },
  { icon: '⚡', title: 'Серия дней', value: '0', meta: 'Будь постоянным' },
];

export default function DashboardPage() {
  const { user: storedUser } = useAuth();
  const { data: freshUser, isLoading } = useGetMeQuery();
  const user = freshUser ?? storedUser;
  const profile = user?.profiles?.find((item: Profile) => item.isActive) ?? user?.profiles?.[0];

  return (
    <section className="dashboard page-section">
      <div className="container">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">Личный кабинет</span>
            <h1>Привет, {user?.username ?? 'разработчик'}! 👋</h1>
            <p>Продолжай подготовку — каждый вопрос приближает тебя к офферу.</p>
          </div>
          <Link className="button button--secondary button--medium" to="/profile">
            Настроить профиль
          </Link>
        </div>

        {isLoading && !user ? (
          <Skeleton lines={5} />
        ) : (
          <>
            <div className="stats-grid">
              {activities.map((item) => (
                <Card key={item.title} className="stat-card">
                  <span className="stat-card__icon">{item.icon}</span>
                  <div>
                    <p>{item.title}</p>
                    <strong>{item.value}</strong>
                    <small>{item.meta}</small>
                  </div>
                </Card>
              ))}
            </div>

            <div className="dashboard-grid">
              <Card className="continue-card">
                <span className="eyebrow">Рекомендуем</span>
                <h2>Начни первую тренировку</h2>
                <p>Ответь на несколько вопросов и получи ориентир для дальнейшей подготовки.</p>
                <Link className="button button--primary button--medium" to="/trainer">
                  Начать тренировку →
                </Link>
              </Card>
              <Card className="profile-progress">
                <div className="card-heading">
                  <h2>Профиль</h2>
                  <Link to="/profile">Изменить</Link>
                </div>
                <div className="profile-mini">
                  <span className="avatar">{user?.username?.[0]?.toUpperCase()}</span>
                  <div>
                    <strong>{user?.username}</strong>
                    <p>{profile?.description || 'Добавь специализацию и навыки'}</p>
                  </div>
                </div>
                <div className="progress-label">
                  <span>Заполненность</span>
                  <strong>{profile ? '70%' : '30%'}</strong>
                </div>
                <div className="progress">
                  <span style={{ width: profile ? '70%' : '30%' }} />
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
