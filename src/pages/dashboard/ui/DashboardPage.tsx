import { useAuth } from '@/features/auth';
import { useGetMeQuery } from '@/entities/user';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user: storedUser } = useAuth();
  const { data: freshUser } = useGetMeQuery();
  const user = freshUser ?? storedUser;

  return (
    <section className={styles.page}>
      <h1>Привет, {user?.username ?? 'Анастасия'}!</h1>
      <div className={styles.placeholder}>
        <span aria-hidden="true">✦</span>
        <p>
          Скоро здесь будут отображаться мероприятия сообщества,
          <br />
          популярные статьи и многое ещё интересного)
        </p>
      </div>
    </section>
  );
}
