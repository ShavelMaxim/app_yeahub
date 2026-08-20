import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/ui';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <section className={styles.page}>
      <EmptyState
        icon="404"
        title="Страница не найдена"
        description="Возможно, адрес изменился или в нём есть ошибка."
        action={
          <Link className={styles.homeLink} to="/">
            На главную
          </Link>
        }
      />
    </section>
  );
}
