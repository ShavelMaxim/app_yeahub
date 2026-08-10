import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/ui';

export default function NotFoundPage() {
  return (
    <section className="page-section container">
      <EmptyState
        icon="404"
        title="Страница не найдена"
        description="Возможно, адрес изменился или в нём есть ошибка."
        action={
          <Link className="button button--primary button--medium" to="/">
            На главную
          </Link>
        }
      />
    </section>
  );
}
